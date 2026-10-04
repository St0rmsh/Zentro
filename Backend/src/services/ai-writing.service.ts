import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatAnthropic } from "@langchain/anthropic";

const generateWritingAssist = async (prompt: string): Promise<string> => {
    if (process.env.GEMINI_API_KEY) {
        try {
            const model = new ChatGoogleGenerativeAI({
                model: "gemini-2.5-flash",
                maxOutputTokens: 500,
                temperature: 0.7,
                apiKey: process.env.GEMINI_API_KEY
            });
            const res = await model.invoke(prompt);
            return (typeof res.content === "string" ? res.content : JSON.stringify(res.content)).trim();
        } catch (error) {
            console.warn("Gemini writing assist failed:", error);
        }
    }

    if (process.env.ANTHROPIC_API_KEY) {
        try {
            const model = new ChatAnthropic({
                model: "claude-haiku-4-5-20251001",
                maxTokens: 500,
                temperature: 0.7,
                apiKey: process.env.ANTHROPIC_API_KEY
            });
            const res = await model.invoke(prompt);
            return (typeof res.content === "string" ? res.content : JSON.stringify(res.content)).trim();
        } catch (error) {
            console.warn("Anthropic writing assist failed:", error);
        }
    }

    throw new Error("No AI providers available");
};

export const suggestTitlesService = async (content: string): Promise<string[]> => {
    const prompt = `Based on the following blog post content, suggest 5 catchy, engaging titles. Return only the titles, one per line.
    
Content:
${content.slice(0, 3000)}`;
    const res = await generateWritingAssist(prompt);
    return res.split('\n').map(t => t.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
};

export const grammarFixService = async (content: string): Promise<string> => {
    const prompt = `Fix any grammar and spelling errors in the following text while preserving the original markdown formatting and tone. Output only the fixed text.
    
Text:
${content}`;
    return await generateWritingAssist(prompt);
};

export const shortenParagraphService = async (content: string): Promise<string> => {
    const prompt = `Make the following paragraph more concise and punchy without losing the core meaning. Output only the shortened text.
    
Text:
${content}`;
    return await generateWritingAssist(prompt);
};

export const suggestTagsService = async (content: string): Promise<string[]> => {
    const prompt = `Suggest 5 relevant tags (single words or short phrases) for the following blog post. Output only the tags, comma-separated.
    
Content:
${content.slice(0, 3000)}`;
    const res = await generateWritingAssist(prompt);
    return res.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
};
