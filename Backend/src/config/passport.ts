import passport from "passport";
import { Strategy as GoogleStrategy, type Profile as GoogleProfile } from "passport-google-oauth20";
import { Strategy as GitHubStrategy, type Profile as GitHubProfile } from "passport-github2";
import crypto from "node:crypto";
import UserModel from "../model/auth.model.js";
import config from "./config.js";

type OAuthProfile = GoogleProfile | GitHubProfile;

const findOrCreateOAuthUser = async (profile: OAuthProfile) => {
    const email = profile.emails?.[0]?.value?.toLowerCase();
    if (!email) throw new Error("This provider did not return an email address");

    let user = await UserModel.findOne({ email });
    if (!user) {
        const baseUsername = (profile.username || profile.displayName || email.split("@")[0] || "user")
            .toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 18) || "user";
        let username = baseUsername;
        let suffix = 1;
        while (await UserModel.exists({ username })) username = `${baseUsername}${suffix++}`.slice(0, 20);
        user = await UserModel.create({
            email,
            username,
            fullname: profile.displayName || username,
            password: crypto.randomBytes(32).toString("hex"),
            isVerified: true,
        });
    } else if (!user.isVerified) {
        user.isVerified = true;
        await user.save();
    }
    user.lastLogin = new Date();
    await user.save();
    return user;
};

if (config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({ clientID: config.GOOGLE_CLIENT_ID, clientSecret: config.GOOGLE_CLIENT_SECRET, callbackURL: config.GOOGLE_CALLBACK_URL }, async (_accessToken, _refreshToken, profile, done) => {
        try { done(null, await findOrCreateOAuthUser(profile)); } catch (error) { done(error as Error); }
    }));
}

if (config.GITHUB_CLIENT_ID && config.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy({ clientID: config.GITHUB_CLIENT_ID, clientSecret: config.GITHUB_CLIENT_SECRET, callbackURL: config.GITHUB_CALLBACK_URL, scope: ["user:email"] }, async (_accessToken: string, _refreshToken: string, profile: GitHubProfile, done: (error: Error | null, user?: unknown) => void) => {
        try { done(null, await findOrCreateOAuthUser(profile)); } catch (error) { done(error as Error); }
    }));
}

export default passport;