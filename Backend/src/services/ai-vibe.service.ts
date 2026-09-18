import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const getVibeScore = async (comments: string[]): Promise<string> => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return "😐 Neutral";
        }
        if (comments.length === 0) return "No comments yet";

        const model = new ChatGoogleGenerativeAI({
            model: "gemini-2.5-flash",
            maxOutputTokens: 64,
            apiKey: process.env.GEMINI_API_KEY
        });

        const prompt = `You are a sentiment analyzer. Review the following recent comments on a post and assign a single "Vibe Check" category. 
        Choose EXACTLY ONE of the following options, and return NOTHING ELSE:
        - 🔥 Positive
        - 🤔 Controversial
        - 💡 Insightful
        - 🛑 Negative
        - 😐 Neutral

        Comments:
        ${comments.map(c => "- " + c).join("\n")}
        `;

        const res = await model.invoke(prompt);
        let vibe = typeof res.content === 'string' ? res.content.trim() : JSON.stringify(res.content);
        vibe = vibe.replace(/```/g, '').trim();

        const validVibes = ["🔥 Positive", "🤔 Controversial", "💡 Insightful", "🛑 Negative", "😐 Neutral"];
        if (validVibes.includes(vibe)) return vibe;
        
        // Match fallback
        for (const v of validVibes) {
            if (vibe.includes(v)) return v;
        }

        return "😐 Neutral";
    } catch (error) {
        console.error("AI Vibe failed:", error);
        return "😐 Neutral";
    }
};
