import PostModel from "../model/post.model.js";
import { generateEmbedding } from "./ai-embedding.service.js";

export const semanticSearchService = async (query: string, page = 1, limit = 10) => {
    try {
        const queryEmbedding = await generateEmbedding(query);

        // Note: This requires a MongoDB Atlas Vector Search index named "vector_index" on the "embedding" field.
        // If not using Atlas, this aggregation will fail. In a real environment without Atlas, 
        // you would use pgvector, Redis, or manually compute cosine similarity for small datasets.
        
        const skip = (page - 1) * limit;

        const results = await PostModel.aggregate([
            {
                $vectorSearch: {
                    index: "vector_index",
                    path: "embedding",
                    queryVector: queryEmbedding,
                    numCandidates: 100,
                    limit: limit
                }
            },
            {
                $match: { isPublished: true }
            },
            {
                $skip: skip
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    tags: 1,
                    category: 1,
                    coverImage: 1,
                    score: { $meta: "vectorSearchScore" }
                }
            }
        ]);

        return {
            posts: results,
            totalPosts: results.length, // approximation since we skip/limit inside agg
            currentPage: page,
            limit
        };

    } catch (error) {
        console.error("Semantic search failed:", error);
        throw new Error(error instanceof Error ? error.message : "Semantic search failed");
    }
};
