import crypto from "crypto";
import { Mistral } from "@mistralai/mistralai";
import { tavily } from "@tavily/core";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatCohere } from "@langchain/cohere";

import PostModel from "../model/post.model.js";
import UserModel from "../model/auth.model.js";

/* ============================================================
   TYPES
============================================================ */

type AIPostCategory =
    | "Technology"
    | "Programming"
    | "AI"
    | "General";

interface AIPostData {
    title: string;
    content: string;
    tags: string[];
    category: AIPostCategory;
}

/* ============================================================
   SYSTEM USER
============================================================ */

const getSystemUser = async () => {
    let user = await UserModel.findOne({
        email: "ai.system@zentro.com"
    });

    if (!user) {
        user = await UserModel.create({
            username: "zentro_ai",
            fullname: "Zentro AI",
            email: "ai.system@zentro.com",
            password: "SecurePassword123!",
            isVerified: true,
            roles: ["author", "admin"],
            bio: "I am an automated AI agent bringing you the latest trends, memes, and news from across the internet.",
        });
    }

    return user;
};

/* ============================================================
   TRENDING TOPICS
============================================================ */

const getTrendingTopics = async (): Promise<string[]> => {
    try {
        const topTags = await PostModel.aggregate([
            {
                $unwind: "$tags"
            },
            {
                $group: {
                    _id: "$tags",
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    count: -1
                }
            },
            {
                $limit: 3
            }
        ]);

        return topTags
            .map((tag) => tag._id as string)
            .filter(
                (tag): tag is string =>
                    typeof tag === "string" &&
                    tag.trim().length > 0
            );
    } catch (error) {
        console.error(
            "Failed to get trending topics:",
            error
        );

        return [];
    }
};

/* ============================================================
   TAVILY SEARCH
============================================================ */

const fetchTrendingContent = async (
    query: string
) => {
    if (!process.env.TAVILY_API_KEY) {
        throw new Error(
            "TAVILY_API_KEY is not configured."
        );
    }

    const tvly = tavily({
        apiKey: process.env.TAVILY_API_KEY
    });

    try {
        const response = await tvly.search(
            query,
            {
                searchDepth: "advanced",
                includeImages: false,
                maxResults: 5
            }
        );

        return {
            query,
            results: response
        };
    } catch (error) {
        console.error(
            "Tavily search failed:",
            error
        );

        throw error;
    }
};

/* ============================================================
   IMAGE FALLBACK
============================================================ */

const generateImageFallback = (
    title: string
): string => {
    const prompt =
        `${title}, highly detailed, professional, with the text "AI" clearly visible`;

    return `https://image.pollinations.ai/prompt/${encodeURIComponent(
        prompt
    )}?seed=${Math.floor(Math.random() * 1000000)}&nologo=true`;
};

/* ============================================================
   AI RESPONSE NORMALIZER
============================================================ */

const normalizeAIResponse = (data: unknown): AIPostData => {
    if (!data) {
        throw new Error(
            "AI returned an empty response."
        );
    }

    let parsedData: unknown = data;

    /*
     * AI providers can return JSON as a string.
     */

    if (typeof parsedData === "string") {
        let cleanedText =
            parsedData
                .replace(/```json/gi, "")
                .replace(/```/g, "")
                .trim();

        /*
         * Sometimes AI adds text before/after JSON.
         * Extract the JSON object.
         */

        const firstBrace =
            cleanedText.indexOf("{");

        const lastBrace =
            cleanedText.lastIndexOf("}");

        if (
            firstBrace !== -1 &&
            lastBrace !== -1 &&
            lastBrace > firstBrace
        ) {
            cleanedText =
                cleanedText.slice(
                    firstBrace,
                    lastBrace + 1
                );
        }

        try {
            parsedData =
                JSON.parse(cleanedText);
        } catch {
            throw new Error(
                `AI returned invalid JSON: ${cleanedText.slice(
                    0,
                    500
                )}`
            );
        }
    }

    if (
        typeof parsedData !== "object" ||
        parsedData === null
    ) {
        throw new Error(
            "AI response is not a valid object."
        );
    }

    const response =
        parsedData as Record<
            string,
            unknown
        >;

    /* ========================================================
       TITLE
    ======================================================== */

    const title =
        typeof response.title === "string"
            ? response.title.trim()
            : "";

    if (!title) {
        throw new Error(
            "AI response is missing required field: title."
        );
    }

    /* ========================================================
       CONTENT
    ======================================================== */

    const content =
        typeof response.content === "string"
            ? response.content.trim()
            : "";

    if (!content) {
        throw new Error(
            "AI response is missing required field: content."
        );
    }

    /* ========================================================
       TAGS
    ======================================================== */

    const tags = Array.isArray(
        response.tags
    )
        ? response.tags
              .filter(
                  (
                      tag
                  ): tag is string =>
                      typeof tag ===
                      "string"
              )
              .map((tag) =>
                  tag
                      .replace(/^#+/, "")
                      .trim()
              )
              .filter(Boolean)
              .slice(0, 5)
        : [];

    if (tags.length === 0) {
        tags.push("Technology");
    }

    /* ========================================================
       CATEGORY
    ======================================================== */

    const validCategories:
        AIPostCategory[] = [
            "Technology",
            "Programming",
            "AI",
            "General"
        ];

    const rawCategory =
        typeof response.category ===
        "string"
            ? response.category.trim()
            : "Technology";

    const category: AIPostCategory =
        validCategories.includes(
            rawCategory as AIPostCategory
        )
            ? (rawCategory as AIPostCategory)
            : "Technology";

    return {
        title: title.slice(0, 100),
        content,
        tags,
        category
    };
};

/* ============================================================
   MISTRAL
============================================================ */

const formatContentWithMistral = async (content: string): Promise<AIPostData> => {
    if (!process.env.MISTRAL_API_KEY) {
        throw new Error(
            "MISTRAL_API_KEY is not configured."
        );
    }

    const client = new Mistral({
        apiKey:
            process.env.MISTRAL_API_KEY
    });

    const prompt = `
You are a social media manager for a tech platform.

Based on the following internet search results,
create a highly engaging, professional yet fun post.

Return ONLY a valid JSON object.

Do NOT use markdown code fences.

The JSON MUST contain:

{
    "title": "A catchy title, maximum 100 characters",
    "content": "The main body of the post in markdown",
    "tags": ["tag1", "tag2", "tag3"],
    "category": "Technology"
}

Rules:

- title is required
- title must be maximum 100 characters
- content is required
- content should be informative and engaging
- tags must contain 3 to 5 strings
- tags must NOT contain #
- category MUST be one of:
  ["Technology", "Programming", "AI", "General"]

Search Results:

${content}
`;

    try {
        const chatResponse =
            await client.chat.complete({
                model:
                    "mistral-large-latest",

                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],

                responseFormat: {
                    type: "json_object"
                }
            });

        const responseContent =
            chatResponse
                .choices?.[0]
                ?.message?.content;

        if (!responseContent) {
            throw new Error(
                "Mistral returned an empty response."
            );
        }

        const rawResponse = typeof responseContent === "string"
                ? responseContent
                : JSON.stringify(
                      responseContent
                  );

        console.log(
            "Mistral response:",
            rawResponse.slice(0, 500)
        );

        return normalizeAIResponse(
            rawResponse
        );
    } catch (error) {
        console.error(
            "Mistral failed:",
            error instanceof Error
                ? error.message
                : error
        );

        throw error;
    }
};

/* ============================================================
   GEMINI
============================================================ */

const formatContentWithGemini = async (content: string): Promise<AIPostData> => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error(
            "GEMINI_API_KEY is not configured."
        );
    }

    const model =
        new ChatGoogleGenerativeAI({
            model: "gemini-1.5-flash",
            maxOutputTokens: 2048,
            apiKey:
                process.env.GEMINI_API_KEY
        });

    const prompt = `
You are a social media manager for a tech platform.

Based on the following internet search results,
create a highly engaging, professional yet fun post.

Respond ONLY with a valid JSON object.

Do NOT use markdown code blocks.

The JSON MUST contain:

{
    "title": "A catchy title, maximum 100 characters",
    "content": "The main body of the post in markdown",
    "tags": ["tag1", "tag2", "tag3"],
    "category": "Technology"
}

Rules:

- title is required
- title must be maximum 100 characters
- content is required
- content should be informative and engaging
- tags must contain 3 to 5 strings
- tags must NOT contain #
- category MUST be one of:
  ["Technology", "Programming", "AI", "General"]

Search Results:

${content}
`;

    try {
        const response =
            await model.invoke(
                prompt
            );

        const contentText =
            typeof response.content ===
            "string"
                ? response.content
                : JSON.stringify(
                      response.content
                  );

        const cleanedText =
            contentText
                .replace(
                    /```json/gi,
                    ""
                )
                .replace(
                    /```/g,
                    ""
                )
                .trim();

        console.log(
            "Gemini response:",
            cleanedText.slice(0, 500)
        );

        return normalizeAIResponse(
            cleanedText
        );
    } catch (error) {
        console.error(
            "Gemini failed:",
            error instanceof Error
                ? error.message
                : error
        );

        throw error;
    }
};

/* ============================================================
   COHERE
============================================================ */

const formatContentWithCohere = async (content: string): Promise<AIPostData> => {
    if (!process.env.COHERE_API_KEY) {
        throw new Error(
            "COHERE_API_KEY is not configured."
        );
    }

    const model = new ChatCohere({
        apiKey:
            process.env.COHERE_API_KEY,
        model: "command-a-03-2025",
        temperature: 0.7
    });

    const prompt = `
You are a social media manager for a tech platform.

Based on the following internet search results,
create a highly engaging, professional yet fun post.

Respond ONLY with a valid JSON object.

Do NOT use markdown code blocks.

The JSON MUST contain:

{
    "title": "A catchy title, maximum 100 characters",
    "content": "The main body of the post in markdown",
    "tags": ["tag1", "tag2", "tag3"],
    "category": "Technology"
}

Rules:

- title is required
- title must be maximum 100 characters
- content is required
- content should be informative and engaging
- tags must contain 3 to 5 strings
- tags must NOT contain #
- category MUST be one of:
  ["Technology", "Programming", "AI", "General"]

Search Results:

${content}
`;

    try {
        const response =
            await model.invoke(
                prompt
            );

        const contentText =
            typeof response.content ===
            "string"
                ? response.content
                : JSON.stringify(
                      response.content
                  );

        const cleanedText =
            contentText
                .replace(
                    /```json/gi,
                    ""
                )
                .replace(
                    /```/g,
                    ""
                )
                .trim();

        console.log(
            "Cohere response:",
            cleanedText.slice(0, 500)
        );

        return normalizeAIResponse(
            cleanedText
        );
    } catch (error) {
        console.error(
            "Cohere failed:",
            error instanceof Error
                ? error.message
                : error
        );

        throw error;
    }
};

/* ============================================================
   AI FALLBACK CHAIN
============================================================ */

const generatePostWithAI = async (searchContext: string): Promise<AIPostData> => {

    /* ========================================================
       1. MISTRAL
    ======================================================== */

    if (process.env.MISTRAL_API_KEY) {
        try {
            console.log(
                "AI Provider: Trying Mistral..."
            );

            const result =
                await formatContentWithMistral(
                    searchContext
                );

            console.log(
                "AI Provider: Mistral succeeded."
            );

            return result;
        } catch (error) {
            console.warn(
                "Mistral failed. Falling back to Gemini."
            );
        }
    } else {
        console.warn(
            "Mistral skipped: API key missing."
        );
    }

    /* ========================================================
       2. GEMINI
    ======================================================== */

    if (process.env.GEMINI_API_KEY) {
        try {
            console.log(
                "AI Provider: Trying Gemini..."
            );

            const result =
                await formatContentWithGemini(
                    searchContext
                );

            console.log(
                "AI Provider: Gemini succeeded."
            );

            return result;
        } catch (error) {
            console.warn(
                "Gemini failed. Falling back to Cohere."
            );
        }
    } else {
        console.warn(
            "Gemini skipped: API key missing."
        );
    }

    /* ========================================================
       3. COHERE
    ======================================================== */

    if (process.env.COHERE_API_KEY) {
        try {
            console.log(
                "AI Provider: Trying Cohere..."
            );

            const result =
                await formatContentWithCohere(
                    searchContext
                );

            console.log(
                "AI Provider: Cohere succeeded."
            );

            return result;
        } catch (error) {
            console.error(
                "Cohere failed. All AI providers failed."
            );

            throw error;
        }
    } else {
        console.error(
            "Cohere skipped: API key missing."
        );
    }

    throw new Error(
        "All AI providers failed or no API keys are configured."
    );
};

/* ============================================================
   AI POSTER
============================================================ */

export const runAIPoster = async (theme?: string): Promise<void> => {
    try {

        /* ====================================================
           API KEY CHECK
        ==================================================== */

        if (!process.env.TAVILY_API_KEY) {
            throw new Error(
                "TAVILY_API_KEY is not configured."
            );
        }

        const hasAIProvider =
            Boolean(
                process.env.MISTRAL_API_KEY
            ) ||
            Boolean(
                process.env.GEMINI_API_KEY
            ) ||
            Boolean(
                process.env.COHERE_API_KEY
            );

        if (!hasAIProvider) {
            throw new Error(
                "No AI provider API key is configured."
            );
        }

        console.log(
            "=========================================="
        );

        console.log(
            "Starting AI Poster Job..."
        );

        /* ====================================================
           SYSTEM USER
        ==================================================== */

        const systemUser =
            await getSystemUser();

        /* ====================================================
           SEARCH THEME
        ==================================================== */

        let searchTheme =
            theme ||
            "latest tech news today";

        const trendingTags =
            await getTrendingTopics();

        if (
            trendingTags.length > 0
        ) {
            searchTheme +=
                ` topics: ${trendingTags.join(
                    ", "
                )}`;
        }

        console.log(
            "Search theme:",
            searchTheme
        );

        /* ====================================================
           TAVILY
        ==================================================== */

        console.log(
            "Searching Tavily..."
        );

        const {
            results
        } =
            await fetchTrendingContent(
                searchTheme
            );

        const searchContext =
            JSON.stringify(
                results.results
            );

        if (
            !searchContext ||
            searchContext === "[]"
        ) {
            throw new Error(
                "Tavily returned empty search results."
            );
        }

        console.log(
            "Tavily search completed."
        );

        /* ====================================================
           AI FALLBACK

           Mistral
              ↓
           Gemini
              ↓
           Cohere
              ↓
           Throw error
        ==================================================== */

        const formattedData =
            await generatePostWithAI(
                searchContext
            );

        /* ====================================================
           FINAL VALIDATION
        ==================================================== */

        const safePostData =
            normalizeAIResponse(
                formattedData
            );

        console.log(
            "Final AI post data:",
            JSON.stringify(
                safePostData,
                null,
                2
            )
        );

        /* ====================================================
           IMAGE
        ==================================================== */

        const mediaUrl =
            generateImageFallback(
                safePostData.title
            );

        const mediaType =
            "image";

        /* ====================================================
           CREATE POST
        ==================================================== */

        const newPost =
            await PostModel.create({
                user: systemUser._id,

                title:
                    safePostData.title,

                content:
                    safePostData.content,

                tags:
                    safePostData.tags,

                category:
                    safePostData.category,

                coverImage:
                    mediaUrl,

                mediaUrl:
                    mediaUrl,

                mediaType:
                    mediaType,

                isPublished:
                    true
            });

        /* ====================================================
           UPDATE SYSTEM USER
        ==================================================== */

        systemUser.postCount += 1;

        await systemUser.save();

        /* ====================================================
           SUCCESS
        ==================================================== */

        console.log(
            "AI Poster Job completed successfully."
        );

        console.log(
            "Created post:",
            newPost._id
        );

        console.log(
            "=========================================="
        );

    } catch (error) {

        console.error(
            "AI Poster Job failed:",
            error instanceof Error
                ? error.message
                : error
        );

        /*
         * IMPORTANT:
         *
         * Do NOT simply return here.
         *
         * If your cron/retry system calls:
         *
         * await runAIPoster()
         *
         * it needs the error to propagate so it
         * knows the job actually failed.
         */

        throw error;
    }
};