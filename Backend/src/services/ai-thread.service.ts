import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatAnthropic } from "@langchain/anthropic";
import CommentModel from "../model/comment.model.js";

const generateSummary = async (prompt: string): Promise<string> => {
    if (process.env.GEMINI_API_KEY) {
        try {
            const model = new ChatGoogleGenerativeAI({
                model: "gemini-2.5-flash",
                maxOutputTokens: 300,
                temperature: 0.2,
                apiKey: process.env.GEMINI_API_KEY
            });
            const res = await model.invoke(prompt);
            return (typeof res.content === "string" ? res.content : JSON.stringify(res.content)).trim();
        } catch (error) {
            console.warn("Gemini thread summary failed:", error);
        }
    }

    if (process.env.ANTHROPIC_API_KEY) {
        try {
            const model = new ChatAnthropic({
                model: "claude-haiku-4-5-20251001",
                maxTokens: 300,
                temperature: 0.2,
                apiKey: process.env.ANTHROPIC_API_KEY
            });
            const res = await model.invoke(prompt);
            return (typeof res.content === "string" ? res.content : JSON.stringify(res.content)).trim();
        } catch (error) {
            console.warn("Anthropic thread summary failed:", error);
        }
    }

    throw new Error("No AI providers available");
};

export const summarizeThreadService = async (postId: string, commentId?: string): Promise<string> => {
    // If commentId is provided, summarize that specific thread, else summarize the whole post's comments
    const query = commentId ? { $or: [{ _id: commentId }, { parentComment: commentId }] } : { post: postId };
    const comments = await CommentModel.find(query).limit(50).populate("user", "username").lean();
    
    if (comments.length < 3) return "Not enough comments to summarize.";

    const text = comments.map(c => `${(c.user as any)?.username || "User"}: ${c.content}`).join("\n");
    
    const prompt = `Summarize the following comment thread. Highlight the key viewpoints, any open questions, and points of agreement. Keep it concise (1-2 paragraphs).

Thread:
${text.slice(0, 5000)}`;

    return await generateSummary(prompt);
};

export const commentNudgeService = async (content: string): Promise<{ isToxic: boolean, warning?: string }> => {
    const prompt = `Analyze the following comment. Is it highly toxic, hostile, or likely to escalate an argument? 
Reply strictly in this JSON format: {"isToxic": true/false, "warning": "A short warning message if toxic"}.

Comment:
${content.slice(0, 1000)}`;

    try {
        const res = await generateSummary(prompt);
        // Strip markdown blocks if any
        const cleaned = res.replace(/```json/gi, "").replace(/```/g, "").trim();
        return JSON.parse(cleaned);
    } catch (e) {
        // Safe fallback
        return { isToxic: false };
    }
};
