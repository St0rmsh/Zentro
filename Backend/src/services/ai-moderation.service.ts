import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatAnthropic } from "@langchain/anthropic";

interface ModerationResult {
    isSafe: boolean;
    reason?: string;
}

const buildPrompt = (content: string): string => `You are an automated content moderator for a tech social media platform. Analyze the following text and determine if it contains toxic language, severe profanity, hate speech, spam, or NSFW content.
        
        Respond ONLY with a valid JSON object containing:
        - "isSafe": boolean (true if the content is completely safe and acceptable, false if it violates guidelines).
        - "reason": string (a short 1-sentence reason if isSafe is false, otherwise empty string).
        
        Text to analyze: "${content}"`;

const parseModerationResponse = (raw: string): ModerationResult => {
    const parsed = JSON.parse(raw);

    const result: ModerationResult = {
        isSafe: Boolean(parsed.isSafe)
    };

    if (typeof parsed.reason === "string" && parsed.reason.length > 0) {
        result.reason = parsed.reason;
    }

    return result;
};

const moderateWithGemini = async (content: string): Promise<ModerationResult> => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }

    const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        maxOutputTokens: 128,
        apiKey: process.env.GEMINI_API_KEY
    });

    const res = await model.invoke(buildPrompt(content));
    const contentText = typeof res.content === 'string' ? res.content : JSON.stringify(res.content);
    const cleanedText = contentText.replace(/```json/g, '').replace(/```/g, '').trim();

    return parseModerationResponse(cleanedText);
};

const moderateWithAnthropic = async (content: string): Promise<ModerationResult> => {
    if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error("ANTHROPIC_API_KEY is not configured.");
    }

    const model = new ChatAnthropic({
        model: "claude-haiku-4-5-20251001",
        maxTokens: 128,
        apiKey: process.env.ANTHROPIC_API_KEY
    });

    const res = await model.invoke(buildPrompt(content));
    const contentText = typeof res.content === 'string' ? res.content : JSON.stringify(res.content);
    const cleanedText = contentText.replace(/```json/g, '').replace(/```/g, '').trim();

    return parseModerationResponse(cleanedText);
};

export const moderateContent = async (content: string): Promise<ModerationResult> => {
    try {
        if (!process.env.GEMINI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
            console.warn("Moderation skipped: No GEMINI_API_KEY or ANTHROPIC_API_KEY found.");
            return { isSafe: true }; // Allow if no API key is configured
        }

        let result: ModerationResult | undefined;

        if (process.env.GEMINI_API_KEY) {
            try {
                result = await moderateWithGemini(content);
            } catch (error) {
                console.warn(
                    "Gemini moderation failed, falling back to Anthropic.",
                    error instanceof Error ? error.message : error
                );
            }
        }

        if (!result && process.env.ANTHROPIC_API_KEY) {
            result = await moderateWithAnthropic(content);
        }

        if (!result) {
            return { isSafe: true };
        }

        return result;
    } catch (error) {
        console.error("AI Moderation failed, defaulting to safe:", error);
        // Fail open so we don't block users if the API goes down
        return { isSafe: true };
    }
};