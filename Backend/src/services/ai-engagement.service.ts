import { Mistral } from "@mistralai/mistralai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatAnthropic } from "@langchain/anthropic";
import CommentModel from "../model/comment.model.js";
import UserModel from "../model/auth.model.js";
import PostModel from "../model/post.model.js";

const buildPrompt = (postContent: string, commentContent: string): string => `You are "Zentro AI", an engaging and witty AI agent on a tech platform. A user just commented on your post.
    Post context: "${postContent.substring(0, 500)}"
    User's comment: "${commentContent}"
    
    Write a short, friendly, and engaging reply to the user. Do not use hashtags. Keep it under 280 characters.
    Respond with ONLY the text of your reply, no quotes or JSON.`;

const generateReplyWithMistral = async (postContent: string, commentContent: string) => {
    const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY || "" });
    const prompt = buildPrompt(postContent, commentContent);

    const chatResponse = await client.chat.complete({
        model: "mistral-small-latest",
        messages: [{ role: "user", content: prompt }]
    });
    const content = chatResponse.choices?.[0]?.message?.content;
    const textContent = typeof content === 'string' ? content : JSON.stringify(content);
    return textContent?.trim() || "Thanks for your comment!";
};

const generateReplyWithGemini = async (postContent: string, commentContent: string) => {
    const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        maxOutputTokens: 256,
        apiKey: process.env.GEMINI_API_KEY || ""
    });

    const prompt = buildPrompt(postContent, commentContent);

    const res = await model.invoke(prompt);
    let replyContent = typeof res.content === 'string' ? res.content : JSON.stringify(res.content);
    replyContent = replyContent.replace(/```markdown/gi, '').replace(/```/g, '').trim();
    return replyContent || "Thanks for your comment!";
};

const generateReplyWithAnthropic = async (postContent: string, commentContent: string) => {
    const model = new ChatAnthropic({
        model: "claude-haiku-4-5-20251001",
        maxTokens: 256,
        apiKey: process.env.ANTHROPIC_API_KEY || ""
    });

    const prompt = buildPrompt(postContent, commentContent);

    const res = await model.invoke(prompt);
    let replyContent = typeof res.content === 'string' ? res.content : JSON.stringify(res.content);
    replyContent = replyContent.replace(/```markdown/gi, '').replace(/```/g, '').trim();
    return replyContent || "Thanks for your comment!";
};

export const handleAICommentEngagement = async (postId: string, commentContent: string, postContent: string) => {
    try {
        if (!process.env.MISTRAL_API_KEY && !process.env.GEMINI_API_KEY && !process.env.ANTHROPIC_API_KEY) return;

        console.log("Generating AI reply for comment...");

        let replyText = "";

        if (process.env.MISTRAL_API_KEY) {
            try {
                replyText = await generateReplyWithMistral(postContent, commentContent);
            } catch (error) {
                console.warn("Mistral failed for engagement, falling back to Gemini...");
                replyText = await tryGeminiThenAnthropic(postContent, commentContent);
            }
        } else {
            replyText = await tryGeminiThenAnthropic(postContent, commentContent);
        }

        const systemUser = await UserModel.findOne({ email: "ai.system@zentro.com" });
        if (!systemUser) return;

        await CommentModel.create({
            post: postId,
            user: systemUser._id,
            content: replyText
        });

        await PostModel.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

        console.log("AI reply created successfully.");
    } catch (error) {
        console.error("AI Engagement failed:", error);
    }
};

const tryGeminiThenAnthropic = async (postContent: string, commentContent: string): Promise<string> => {
    if (process.env.GEMINI_API_KEY) {
        try {
            return await generateReplyWithGemini(postContent, commentContent);
        } catch (error) {
            console.warn("Gemini failed for engagement, falling back to Anthropic...");
        }
    }

    if (process.env.ANTHROPIC_API_KEY) {
        return await generateReplyWithAnthropic(postContent, commentContent);
    }

    return "Thanks for your comment!";
};