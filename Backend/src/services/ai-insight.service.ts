import CommentModel from "../model/comment.model.js";
import PostModel from "../model/post.model.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatAnthropic } from "@langchain/anthropic";

const generateClusteredInsights = async (questions: string[]): Promise<string> => {
    const prompt = `You are an AI assistant helping a blog author understand what their readers are asking.
Below is a list of questions extracted from comments on their posts. 
Group these questions into themes (e.g., "5 readers asked about caching"). 
Format your output as a short summary of the main themes, highlighting what the author might want to address in future posts.

Questions:
${questions.map((q, i) => `${i + 1}. ${q}`).join("\n")}
`;

    if (process.env.GEMINI_API_KEY) {
        try {
            const model = new ChatGoogleGenerativeAI({
                model: "gemini-2.5-flash",
                maxOutputTokens: 500,
                temperature: 0.2,
                apiKey: process.env.GEMINI_API_KEY
            });
            const res = await model.invoke(prompt);
            return (typeof res.content === "string" ? res.content : JSON.stringify(res.content)).trim();
        } catch (error) {
            console.warn("Gemini clustering failed:", error);
        }
    }

    if (process.env.ANTHROPIC_API_KEY) {
        try {
            const model = new ChatAnthropic({
                model: "claude-haiku-4-5-20251001",
                maxTokens: 500,
                temperature: 0.2,
                apiKey: process.env.ANTHROPIC_API_KEY
            });
            const res = await model.invoke(prompt);
            return (typeof res.content === "string" ? res.content : JSON.stringify(res.content)).trim();
        } catch (error) {
            console.warn("Anthropic clustering failed:", error);
        }
    }

    return "Insights could not be generated.";
};

export const getReaderQuestionsInsightService = async (authorId: string): Promise<string> => {
    try {
        // Get all posts by this author
        const authorPosts = await PostModel.find({ user: authorId }).select("_id").lean();
        const postIds = authorPosts.map(p => p._id);

        if (postIds.length === 0) return "You have no posts yet.";

        // Get comments that contain a question mark
        const questions = await CommentModel.find({
            post: { $in: postIds },
            content: { $regex: /\?/, $options: "i" },
            isAI: { $ne: true }
        }).select("content").limit(100).lean();

        if (questions.length === 0) return "No reader questions found.";

        const questionTexts = questions.map(q => q.content);

        return await generateClusteredInsights(questionTexts);
    } catch (error) {
        console.error("Reader questions insight failed:", error);
        throw new Error(error instanceof Error ? error.message : "Insight generation failed");
    }
};
