import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import MessageModel from "../model/message.model.js";
import UserModel from "../model/auth.model.js";
import { getIO } from "../Socket/socket.js";

export const handleAIChatMessage = async (userId: string, userMessageContent: string) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.warn("AI Chat skipped: No GEMINI_API_KEY");
            return;
        }
        
        const systemUser = await UserModel.findOne({ email: "ai.system@zentro.com" });
        if (!systemUser) return;

        const user = await UserModel.findById(userId);
        if (!user) return;

        const model = new ChatGoogleGenerativeAI({
            model: "gemini-1.5-flash",
            maxOutputTokens: 256,
            apiKey: process.env.GEMINI_API_KEY
        });

        const prompt = `You are "Zentro AI", a helpful, witty, and concise AI Tech Buddy on a social media platform. 
The user "${user.username}" just sent you a message:
"${userMessageContent}"

Write a short, engaging reply as Zentro AI. Do not use quotes or markdown code blocks for the main reply unless providing code. Keep it under 500 characters.`;

        const res = await model.invoke(prompt);
        let replyText = typeof res.content === 'string' ? res.content.trim() : JSON.stringify(res.content);
        
        // Basic cleanup if Gemini returns json format
        replyText = replyText.replace(/```markdown/gi, '').replace(/```/g, '').trim();

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
