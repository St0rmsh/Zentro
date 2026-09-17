import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const moderateContent = async (content: string): Promise<{ isSafe: boolean; reason?: string }> => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.warn("Moderation skipped: No GEMINI_API_KEY found.");
            return { isSafe: true }; // Allow if no API key is configured
        }

        const model = new ChatGoogleGenerativeAI({
            model: "gemini-1.5-flash",
            maxOutputTokens: 128,
            apiKey: process.env.GEMINI_API_KEY
        });

        const prompt = `You are an automated content moderator for a tech social media platform. Analyze the following text and determine if it contains toxic language, severe profanity, hate speech, spam, or NSFW content.
        
        Respond ONLY with a valid JSON object containing:
        - "isSafe": boolean (true if the content is completely safe and acceptable, false if it violates guidelines).
        - "reason": string (a short 1-sentence reason if isSafe is false, otherwise empty string).
        
        Text to analyze: "${content}"`;

        const res = await model.invoke(prompt);
        const contentText = typeof res.content === 'string' ? res.content : JSON.stringify(res.content);
        const cleanedText = contentText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const result = JSON.parse(cleanedText);
        return {
            isSafe: result.isSafe,
            reason: result.reason
        };
    } catch (error) {
        console.error("AI Moderation failed, defaulting to safe:", error);
        // Fail open so we don't block users if the API goes down
        return { isSafe: true };
    }
};
