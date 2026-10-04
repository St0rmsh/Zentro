import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export const generateEmbedding = async (text: string): Promise<number[]> => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing");
    }

    const embeddings = new GoogleGenerativeAIEmbeddings({
        modelName: "text-embedding-004", // Or "embedding-001"
        apiKey: process.env.GEMINI_API_KEY
    });

    const res = await embeddings.embedQuery(text);
    return res;
};
