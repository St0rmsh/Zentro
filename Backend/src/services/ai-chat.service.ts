import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatAnthropic } from "@langchain/anthropic";
import MessageModel from "../model/message.model.js";
import UserModel from "../model/auth.model.js";
import { getIO } from "../Socket/socket.js";

const buildPrompt = (username: string, userMessageContent: string): string => `You are "Zentro AI", a helpful, witty, and concise AI Tech Buddy on a social media platform. 
The user "${username}" just sent you a message:
"${userMessageContent}"

Write a short, engaging reply as Zentro AI. Do not use quotes or markdown code blocks for the main reply unless providing code. Keep it under 500 characters.`;

const cleanReply = (raw: string): string =>
    raw.replace(/```markdown/gi, "").replace(/```/g, "").trim();

const generateReplyWithGemini = async (prompt: string): Promise<string> => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }

    const model = new ChatGoogleGenerativeAI({
        model: "gemini-1.5-flash",
        maxOutputTokens: 256,
        apiKey: process.env.GEMINI_API_KEY
    });

    const res = await model.invoke(prompt);
    const replyText = typeof res.content === 'string' ? res.content.trim() : JSON.stringify(res.content);
    return cleanReply(replyText);
};

const generateReplyWithAnthropic = async (prompt: string): Promise<string> => {
    if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error("ANTHROPIC_API_KEY is not configured.");
    }

    const model = new ChatAnthropic({
        model: "claude-haiku-4-5-20251001",
        maxTokens: 256,
        apiKey: process.env.ANTHROPIC_API_KEY
    });

    const res = await model.invoke(prompt);
    const replyText = typeof res.content === 'string' ? res.content.trim() : JSON.stringify(res.content);
    return cleanReply(replyText);
};

export const handleAIChatMessage = async (userId: string, userMessageContent: string) => {
    try {
        if (!process.env.GEMINI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
            console.warn("AI Chat skipped: No GEMINI_API_KEY or ANTHROPIC_API_KEY");
            return;
        }

        const systemUser = await UserModel.findOne({ email: "ai.system@zentro.com" });
        if (!systemUser) return;

        const user = await UserModel.findById(userId);
        if (!user) return;

        const prompt = buildPrompt(user.username, userMessageContent);

        let replyText = "";

        if (process.env.GEMINI_API_KEY) {
            try {
                replyText = await generateReplyWithGemini(prompt);
            } catch (error) {
                console.warn(
                    "Gemini failed for chat, falling back to Anthropic...",
                    error instanceof Error ? error.message : error
                );
                replyText = await generateReplyWithAnthropic(prompt);
            }
        } else {
            replyText = await generateReplyWithAnthropic(prompt);
        }

        const aiMessage = await MessageModel.create({
            sender: systemUser._id,
            recipient: userId,
            content: replyText
        });

        const populated = await aiMessage.populate("sender", "username fullname avatar");
        getIO().to(userId).emit("message:new", populated);

    } catch (error) {
        console.error("AI Chat failed:", error);
    }
};