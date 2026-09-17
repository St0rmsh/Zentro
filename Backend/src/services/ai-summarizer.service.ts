import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const generatePostSummary = async (content: string): Promise<string> => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not configured.");
        }

        const model = new ChatGoogleGenerativeAI({
            model: "gemini-1.5-flash",
            maxOutputTokens: 256,
            apiKey: process.env.GEMINI_API_KEY
        });

        const prompt = `You are an AI reading assistant. Summarize the following post content into exactly 3 concise bullet points. 
        Each bullet point must start with a short emoji relevant to the point.
        Return ONLY the markdown bullet points, with no extra text or markdown code fences.

        Post content:
        "${content.substring(0, 3000)}"`;

        const res = await model.invoke(prompt);
        let summaryText = typeof res.content === 'string' ? res.content : JSON.stringify(res.content);
        
        // Clean up any markdown code fences if AI adds them
        summaryText = summaryText.replace(/```markdown/gi, '').replace(/```/g, '').trim();

        return summaryText;
    } catch (error) {
        console.error("AI Summarizer failed:", error);
        throw new Error("Failed to generate summary.");
    }
};
