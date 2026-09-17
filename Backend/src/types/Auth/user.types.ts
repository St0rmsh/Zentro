
 type UserRole =
    | "user"
    | "author"
    | "admin";


export interface IUser {
    _id: string,
    username: string,
    fullname: string,
    email: string,
    password: string,
    isVerified: boolean,
    avatar: string,
    bio: string,
    banner: string,
    postCount: number,
    roles: UserRole[],
    isActive: boolean,
        blockedUsers: string[],
        mutedUsers: string[],
    privacy: {
        privateAccount: boolean,
        activityStatus: boolean,
        searchVisibility: boolean,
    },
    settings: {
        theme: "light" | "dark" | "system",
        language: "en" | "es" | "fr" | "de",
        reducedMotion: boolean,
        compactMode: boolean,
        autoPlayMedia: boolean,
    },
    notificationPreferences: {
        likes: boolean,
        comments: boolean,
        follows: boolean,
        mentions: boolean,
        bookmarks: boolean,
    },
    lastLogin?: Date,
    createdAt?: Date,
    updatedAt?: Date
}


export interface RegisterBody {
    username: string,
    fullname: string,
    email: string,
    password: string,
}


export interface LoginBody {
    email: string,
    password: string,
    username?: string
}


export interface UpdateUserBody {
    fullname?: string,
    avatar?: string,
    bio?: string,
    banner?: string,
    username?: string,
}


export interface EmailOptions {
    email: string;
    subject: string;
    text?: string;
    html?: string;
}

export type UserSettingsUpdate = Partial<IUser["privacy"]> & Partial<IUser["settings"]> & Partial<IUser["notificationPreferences"]>;