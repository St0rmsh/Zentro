import mongoose from "mongoose"
import config from "./config.js"


async function ConnectDB() {
    try {
        await mongoose.connect(config.MONGO_URI)
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}

export default ConnectDB