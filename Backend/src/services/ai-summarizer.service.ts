import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

type ContentType =
    | "greeting"
    | "very-short"
    | "question"
    | "code"
    | "news"
    | "tutorial"
    | "article";

const detectContentType = (content: string): ContentType => {
    const text = content.trim();
    const lower = text.toLowerCase();

    // Greetings / casual messages
    const greetingPatterns = [
        /^(hi|hello|hey|heyy|heyyy|hola|yo|sup|wassup|what's up|whats up)\b/i,
        /^(good morning|good afternoon|good evening|good night)\b/i,
        /^(hello|hi|hey)\s+(everyone|all|guys|boii|bro|broo|friends)\b/i,
    ];

    if (
        greetingPatterns.some((pattern) => pattern.test(text)) &&
        text.length <= 100
    ) {
        return "greeting";
    }

    // Very short posts
    const words = text.split(/\s+/).filter(Boolean);

    if (words.length <= 12 || text.length <= 80) {
        return "very-short";
    }

    // Questions
    const questionPatterns = [
        /\?$/,
        /^(what|why|how|when|where|who|which|can|could|should|would|is|are|do|does|did|will|has|have)\b/i,
    ];

    if (questionPatterns.some((pattern) => pattern.test(text))) {
        return "question";
    }

    // Code / programming posts
    const codeIndicators = [
        "```",
        "function ",
        "const ",
        "let ",
        "var ",
        "import ",
        "export ",
        "class ",
        "interface ",
        "async ",
        "await ",
        "=>",
        "npm ",
        "pnpm ",
        "yarn ",
        "git ",
        "react",
        "typescript",
        "javascript",
        "node.js",
        "nodejs",
        "python",
        "java ",
        "c++",
        "mongodb",
        "mongoose",
        "express",
        "api",
        "docker",
        "kubernetes",
        "sql",
        "graphql",
    ];

    const codeScore = codeIndicators.filter((indicator) =>
        lower.includes(indicator)
    ).length;

    if (codeScore >= 2 || lower.includes("```")) {
        return "code";
    }

    // News / current events
    const newsIndicators = [
        "breaking",
        "breaking news",
        "reported",
        "reports",
        "according to",
        "announced",
        "announcement",
        "government",
        "president",
        "minister",
        "election",
        "court",
        "police",
        "officials",
        "today",
        "yesterday",
        "this morning",
        "this evening",
        "latest",
        "update",
        "incident",
        "attack",
        "arrested",
        "died",
        "killed",
        "launched",
        "acquired",
        "resigned",
    ];

    const newsScore = newsIndicators.filter((indicator) =>
        lower.includes(indicator)
    ).length;

    if (newsScore >= 2) {
        return "news";
    }

    // Tutorials / educational posts
    const tutorialIndicators = [
        "how to",
        "step by step",
        "step-by-step",
        "tutorial",
        "guide",
        "learn",
        "learning",
        "beginner",
        "first step",
        "next step",
        "install",
        "setup",
        "set up",
        "configure",
        "configuration",
        "build",
        "create",
        "implementation",
        "example",
        "here's how",
        "heres how",
    ];

    const tutorialScore = tutorialIndicators.filter((indicator) =>
        lower.includes(indicator)
    ).length;

    if (tutorialScore >= 2) {
        return "tutorial";
    }

    // Default: normal article
    return "article";
};

const getLocalSummary = (
    content: string,
    type: ContentType
): string | null => {
    const text = content.trim();

    if (type === "greeting") {
        return [
            "👋 A friendly greeting.",
            "💬 The message opens with a casual and informal tone.",
            "😊 It is a simple social interaction rather than an informational post.",
        ].join("\n");
    }

    if (type === "very-short") {
        return [
            `📝 ${text}`,
            "💡 The post is brief and contains limited additional context.",
            "🔎 No extra information is inferred beyond what is explicitly written.",
        ].join("\n");
    }

    return null;
};

const getPromptForContentType = (
    content: string,
    type: ContentType
): string => {
    const baseRules = `
You are Zentro's AI Reading Assistant.

Summarize the provided post accurately and naturally.

GENERAL RULES:
- Return EXACTLY 3 concise markdown bullet points.
- Every bullet MUST begin with ONE relevant emoji.
- Return ONLY the 3 bullet points.
- Do NOT add a title, introduction, conclusion, or code fence.
- Do NOT say "the author says", "the post discusses", "the user mentions",
  "a greeting is extended", or other meta descriptions.
- Summarize the actual meaning and information contained in the post.
- NEVER invent facts, names, dates, statistics, events, or conclusions.
- Preserve important terminology and technical details.
- If information is uncertain or merely claimed in the post, do not present
  it as independently verified fact.
`;

    const typeInstructions: Record<ContentType, string> = {
        greeting: `
CONTENT TYPE: GREETING

This category should normally be handled locally.
`,

        "very-short": `
CONTENT TYPE: VERY SHORT

- Do not invent context.
- Preserve the actual meaning of the message.
- Do not create artificial information.
- Mention the limited amount of information naturally.
`,

        question: `
CONTENT TYPE: QUESTION

Focus on:
- What the person is asking.
- The important context surrounding the question.
- Any constraints, technologies, examples, or details included.

Do not answer the question unless the post itself contains an answer.
The goal is to summarize the question, not solve it.
`,

        code: `
CONTENT TYPE: CODE / PROGRAMMING

Focus on:
- What the code or technical post is trying to accomplish.
- Important implementation details.
- Main behavior, issue, approach, or result.

If code is present:
- Do not reproduce large code blocks.
- Do not invent what the code does.
- Mention relevant frameworks, libraries, APIs, or technologies when explicitly present.
- If the post describes a bug or error, clearly identify the reported problem.
`,

        news: `
CONTENT TYPE: NEWS / CURRENT EVENT

Focus on:
- The main event or reported development.
- Important people, organizations, places, or entities explicitly mentioned.
- Key reported consequence, statement, or development.

Do not add facts from outside the post.
Do not turn allegations or reported claims into established facts.
Preserve dates or numbers when explicitly provided.
`,

        tutorial: `
CONTENT TYPE: TUTORIAL / EDUCATIONAL

Focus on:
- What the reader is being taught.
- Main concepts or tools involved.
- Important steps or practical takeaway.

Keep the summary useful to someone deciding whether the tutorial is relevant.
Do not reproduce every individual instruction.
`,

        article: `
CONTENT TYPE: NORMAL LONG-FORM ARTICLE

Focus on:
- The central idea.
- The two most important supporting points.
- The main conclusion, implication, or takeaway if explicitly supported.

Prioritize substance over describing the structure of the article.
`,
    };

    return `
${baseRules}

${typeInstructions[type]}

POST:
${content}
`;
};

export const generatePostSummary = async (
    content: string
): Promise<string> => {
    try {
        if (!content || !content.trim()) {
            return [
                "📝 The post does not contain any readable content.",
                "💡 There is not enough information to generate a meaningful summary.",
                "🔎 No additional context can be inferred.",
            ].join("\n");
        }

        const cleanContent = content
            .replace(/<[^>]*>/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        const contentType = detectContentType(cleanContent);

        console.log(
            `AI Summary: detected content type = ${contentType}`
        );

        // Handle greetings and very short posts locally.
        const localSummary = getLocalSummary(
            cleanContent,
            contentType
        );

        if (localSummary) {
            return localSummary;
        }

        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not configured.");
        }

        const model = new ChatGoogleGenerativeAI({
            model: "gemini-2.5-flash",
            maxOutputTokens: 256,
            apiKey: process.env.GEMINI_API_KEY,
        });

        const truncatedContent = cleanContent.substring(0, 3000);

        const prompt = getPromptForContentType(
            truncatedContent,
            contentType
        );

        const res = await model.invoke(prompt);

        let summaryText =
            typeof res.content === "string"
                ? res.content
                : JSON.stringify(res.content);

        summaryText = summaryText
            .replace(/```markdown/gi, "")
            .replace(/```/g, "")
            .trim();

        if (!summaryText) {
            throw new Error("Gemini returned an empty summary.");
        }

        return summaryText;
    } catch (error) {
        console.error("AI Summarizer failed:", error);
        throw new Error("Failed to generate summary.");
    }
};