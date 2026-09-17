import mongoose, { Document } from "mongoose";
import type { IUser } from "../types/Auth/user.types.js";
import bcrypt from "bcrypt"


export interface UserDocument extends Omit<IUser, "_id">,Document{
comparePassword: (password: string) => Promise<boolean>}

const USER_ROLES = [
    "user",
    "author",
    "admin"
] as const;

const userSchema = new mongoose.Schema<UserDocument>({
    username: {
        type: String,
        required: true,
        unique:true,
        trim: true,
        lowercase:true
    },
    fullname: {
        type: String,
        required: [true,"Fullname is required"],
        trim:true
    },
    email: {
        type: String,
        required: [true,"Email is required"],
        unique:true,
        trim:true,
        lowercase:true
    },
    password: {
        type: String,
        required: [true,"Password is required"],
        minlength: [6,"Password must be at least 6 characters long"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: "https://ik.imagekit.io/p7b10nfhs/default.png?updatedAt=1770739987572"
    },
    bio: {
        type: String,
        maxlength: 300,
        default: ""
    },
    banner: {
        type: String,
        default: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop"
    },
    postCount: {
        type: Number,
        default: 0
    },
    roles: {
        type: [String],
        enum: USER_ROLES,
        default: ["user"]
    },
    isActive: {
        type: Boolean,
        default: true
    },
        blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        mutedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    privacy: {
        privateAccount: { type: Boolean, default: false },
        activityStatus: { type: Boolean, default: true },
        searchVisibility: { type: Boolean, default: true },
    },
    settings: {
        theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
        language: { type: String, enum: ["en", "es", "fr", "de"], default: "en" },
        reducedMotion: { type: Boolean, default: false },
        compactMode: { type: Boolean, default: false },
        autoPlayMedia: { type: Boolean, default: true },
    },
    notificationPreferences: {
        likes: { type: Boolean, default: true },
        comments: { type: Boolean, default: true },
        follows: { type: Boolean, default: true },
        mentions: { type: Boolean, default: true },
        bookmarks: { type: Boolean, default: true },
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
},{
    timestamps:true
})


userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});


userSchema.methods.comparePassword = function (password: string) {
    return bcrypt.compare(password, this.password);
};


const UserModel = mongoose.model("User",userSchema)

export default UserModel