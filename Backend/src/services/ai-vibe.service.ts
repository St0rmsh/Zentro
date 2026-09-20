import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatAnthropic } from "@langchain/anthropic";

const validVibes = ["🔥 Positive", "🤔 Controversial", "💡 Insightful", "🛑 Negative", "😐 Neutral"];

const buildPrompt = (comments: string[]): string => `You are a sentiment analyzer. Review the following recent comments on a post and assign a single "Vibe Check" category. 
        Choose EXACTLY ONE of the following options, and return NOTHING ELSE:
        - 🔥 Positive
        - 🤔 Controversial
        - 💡 Insightful
        - 🛑 Negative
        - 😐 Neutral

        Comments:
        ${comments.map(c => "- " + c).join("\n")}
        `;

const normalizeVibe = (raw: string): string | null => {
    let vibe = raw.trim().replace(/```/g, '').trim();

    if (validVibes.includes(vibe)) return vibe;

    for (const v of validVibes) {
        if (vibe.includes(v)) return v;
    }

    return null;
};

const getVibeWithGemini = async (comments: string[]): Promise<string | null> => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }

    const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        maxOutputTokens: 64,
        apiKey: process.env.GEMINI_API_KEY
    });

    const res = await model.invoke(buildPrompt(comments));
    const vibe = typeof res.content === 'string' ? res.content : JSON.stringify(res.content);
    return normalizeVibe(vibe);
};

const getVibeWithAnthropic = async (comments: string[]): Promise<string | null> => {
    if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error("ANTHROPIC_API_KEY is not configured.");
    }

    const model = new ChatAnthropic({
        model: "claude-haiku-4-5-20251001",
        maxTokens: 64,
        apiKey: process.env.ANTHROPIC_API_KEY
    });

    const res = await model.invoke(buildPrompt(comments));
    const vibe = typeof res.content === 'string' ? res.content : JSON.stringify(res.content);
    return normalizeVibe(vibe);
};

export const getVibeScore = async (comments: string[]): Promise<string> => {
    try {
        if (!process.env.GEMINI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
            return "😐 Neutral";
        }
        if (comments.length === 0) return "No comments yet";

        if (process.env.GEMINI_API_KEY) {
            try {
                const vibe = await getVibeWithGemini(comments);
                if (vibe) return vibe;
            } catch (error) {
                console.warn(
                    "Gemini vibe check failed, falling back to Anthropic.",
                    error instanceof Error ? error.message : error
                );
            }
        }

        if (process.env.ANTHROPIC_API_KEY) {
            const vibe = await getVibeWithAnthropic(comments);
            if (vibe) return vibe;
        }

        return "😐 Neutral";
    } catch (error) {
        console.error("AI Vibe failed:", error);
        return "😐 Neutral";
    }
};