import cron from "node-cron";
import { runAIPoster } from "../services/ai-poster.service.js";
import PostModel from "../model/post.model.js";
import UserModel from "../model/auth.model.js";

const TIMEZONE = "Asia/Kolkata";
const RETRY_DELAY_MS = 5 * 60 * 1000; // 5 minutes

// The 3 daily scheduled slots with their IST hours and themes
const SCHEDULED_SLOTS = [
    { hour: 9, theme: "Morning Tech News Briefing", label: "9 AM" },
    { hour: 14, theme: "Midday Programming Meme / Joke", label: "2 PM" },
    { hour: 19, theme: "Deep-dive / Discussion Starter on AI", label: "7 PM" },
];

const runWithRetry = async (theme: string, label: string) => {
    try {
        await runAIPoster(theme);
    } catch (error) {
        console.error(`AI Poster Job (${label}) failed. Retrying in 5 minutes...`, error);
        setTimeout(async () => {
            try {
                console.log(`Retrying AI Poster Job (${label})...`);
                await runAIPoster(theme);
            } catch (retryError) {
                console.error(`AI Poster Job (${label}) retry also failed:`, retryError);
            }
        }, RETRY_DELAY_MS);
    }
};

/**
 * On server startup, check if any scheduled AI posts were missed today
 * (e.g. because the server was offline). If a slot's time has already
 * passed but there's no AI post created after that slot time, create it now.
 */
const catchUpMissedPosts = async () => {
    try {
        const aiUser = await UserModel.findOne({ email: "ai.system@zentro.com" });
        if (!aiUser) {
            console.log("Catch-up: AI user not found yet — skipping (will be created on first post).");
            // If the AI user doesn't exist, we should still create posts for missed slots
            // runAIPoster will create the user automatically
        }

        // Get current time in IST
        const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: TIMEZONE }));
        const currentHour = nowIST.getHours();

        // Build the start of today in IST (midnight IST)
        const todayStartIST = new Date(nowIST);
        todayStartIST.setHours(0, 0, 0, 0);
        // Convert IST midnight to UTC for DB query (IST is UTC+5:30)
        const todayStartUTC = new Date(todayStartIST.getTime() - (5.5 * 60 * 60 * 1000));

        // Count how many AI posts exist today
        const aiPostsToday = aiUser
            ? await PostModel.countDocuments({
                user: aiUser._id,
                createdAt: { $gte: todayStartUTC },
            })
            : 0;

        // Figure out how many slots should have fired by now
        const passedSlots = SCHEDULED_SLOTS.filter(slot => currentHour >= slot.hour);

        // Number of missed posts = slots that should have fired - posts that exist
        const missedCount = passedSlots.length - aiPostsToday;

        if (missedCount <= 0) {
            console.log(`Catch-up: No missed posts. (${aiPostsToday} AI post(s) found today, ${passedSlots.length} slot(s) passed)`);
            return;
        }

        console.log(`Catch-up: ${missedCount} missed post(s) detected. Creating now...`);

        // Run the missed slots (pick the most recent missed ones)
        const slotsToRun = passedSlots.slice(-missedCount);
        for (const slot of slotsToRun) {
            console.log(`Catch-up: Creating missed post for "${slot.label}" slot...`);
            await runWithRetry(slot.theme, `Catch-up ${slot.label}`);
            // Small delay between posts to avoid rate-limiting
            await new Promise(resolve => setTimeout(resolve, 3000));
        }

        console.log("Catch-up: All missed posts created.");
    } catch (error) {
        console.error("Catch-up check failed:", error);
    }
};

export const initCronJobs = () => {
    // Run at 9:00 AM IST every day
    cron.schedule("0 9 * * *", async () => {
        console.log("Running scheduled AI Poster Job at 9 AM IST");
        await runWithRetry("Morning Tech News Briefing", "9 AM");
    }, { timezone: TIMEZONE });

    // Run at 2:00 PM IST every day
    cron.schedule("0 14 * * *", async () => {
        console.log("Running scheduled AI Poster Job at 2 PM IST");
        await runWithRetry("Midday Programming Meme / Joke", "2 PM");
    }, { timezone: TIMEZONE });

    // Run at 7:00 PM IST every day
    cron.schedule("0 19 * * *", async () => {
        console.log("Running scheduled AI Poster Job at 7 PM IST");
        await runWithRetry("Deep-dive / Discussion Starter on AI", "7 PM");
    }, { timezone: TIMEZONE });

    console.log(`Cron jobs initialized (AI Poster scheduled for 9 AM, 2 PM, 7 PM ${TIMEZONE}).`);

    // Check for missed posts on startup (runs after a short delay to let DB connect)
    setTimeout(() => {
        catchUpMissedPosts().catch(console.error);
    }, 5000);
};

