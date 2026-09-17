import type { Request, Response } from "express";
import type { RegisterBody } from "../types/Auth/user.types.js";
import UserModel from "../model/auth.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { changePasswordService, deleteAccountService, forgotPasswordService, generateAccessTokenService, getMyProfileService, getPrivacyListsService, getUserSettingsService, loginUserService, logoutService, registerUserService, resetPasswordService, sendOtpService, updateAccountStatusService, updatePrivacyListService, updateUserDetailsService, updateUserSettingsService, verifyOtpService } from "../services/user.service.js";


// for registration controller
export const registrationController = async (req: Request<{}, {}, RegisterBody>,
    res: Response) => {

    try {

        const { user } = await registerUserService(req.body)

        console.log("user", user)

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: { user, email: req.body.email }
            
        })


    } catch (error) {
        console.error("Error in register controller:", error);

        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Registration failed"
        });

    }
}

// for login controller

export const loginController = async (req: Request<{}, {}, RegisterBody>,
    res: Response) => {

    try {

        const { user, accessToken, refreshToken } = await loginUserService(req.body)

        console.log("user", user)

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        console.log("user =>", user)


        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: {
                user,
                accessToken,
                refreshToken
            }
        })


    } catch (error) {
        console.error("Error in login controller:", error);

        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "login failed"
        });

    }
}

export const oauthCallbackController = (req: Request, res: Response) => {
    const user = req.user as { _id: string; email: string; roles: string[] } | undefined;
    if (!user) return res.redirect(`${config.FRONTEND_ORIGIN}/auth/login?oauth=failed`);

    const accessToken = jwt.sign({ _id: user._id, email: user.email, roles: user.roles }, config.ACCESS_TOKEN, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ _id: user._id, email: user.email, roles: user.roles }, config.REFRESH_TOKEN, { expiresIn: "7d" });
    const cookieOptions = { httpOnly: true, secure: config.NODE_ENV === "production", sameSite: "strict" as const };
    res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.redirect(config.FRONTEND_ORIGIN);
};

export const getUser = async (req: Request, res: Response) => {
    try {

        const id = req.user?._id;

        if (!id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const result = await getMyProfileService(id);
        if (!result) {
            throw new Error("User not found")
        }

        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: result.user,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Server error"
        });
    }
}

// for refresh access token controller

export const refreshAccessTokenController = async (req: Request, res: Response) => {
    try {

        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            throw new Error("Unauthorized")
        }

        const accessToken = await generateAccessTokenService(refreshToken);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
            data: { accessToken },
        })

    } catch (error) {
        console.error("Error in refresh access token controller:", error);

        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "refresh access token failed"
        });
    }
}


// for logout controller

export const logoutController = async (req: Request, res: Response) => {
    try {

        const refreshToken = req.cookies?.refreshToken;
        const accessToken = req.cookies?.accessToken;

        if (refreshToken && accessToken) {
            await logoutService(refreshToken, accessToken);
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");


        res.status(200).json({
            success: true,
            message: "User logged out successfully",
        })


    } catch (error) {
        console.error("Error in logout controller:", error);

        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "logout failed"
        });
    }
}


// for update user controller

export const updateUserController = async (req: Request, res: Response) => {
    try {

        const id = req.user?._id;

        if (!id) {
            throw new Error("Unauthorized")
        }

        const files = req.files as {
            avatar?: Express.Multer.File[];
            banner?: Express.Multer.File[];
        };



        const updatedUser = await updateUserDetailsService(id, req.body, files)

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        })



    } catch (error) {
        console.error("Error in update user controller:", error);

        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "update user failed"
        });
    }
}

// for send otp controller 

export const sendOtpController = async (req: Request, res: Response) => {
    try {
        console.log("req.user =>", req.user);


        const email = req.body.email || req.user?.email;

        if (!email) {
            throw new Error("Unauthorized");
        }

        const result = await sendOtpService(email);

        return res.status(200).json(result);

    } catch (error) {
        console.error("Error in verify email controller:", error);

        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "verify email failed"
        });
    }
}


// for verify email controller 


export const verifyOtpController = async (
    req: Request,
    res: Response
) => {

    try {

        const email = req.body.email || req.user?.email;

        const { otp } = req.body;

        if (!email) throw new Error("Email is required");

        const result = await verifyOtpService(
            email,
            otp
        );

        const user = await UserModel.findOne({ email });
        if (!user) throw new Error("User not found");

        const accessToken = jwt.sign({ _id: user._id, email: user.email, roles: user.roles }, config.ACCESS_TOKEN, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ _id: user._id, email: user.email, roles: user.roles }, config.REFRESH_TOKEN, { expiresIn: "7d" });
        res.cookie("accessToken", accessToken, { httpOnly: true, secure: config.NODE_ENV === "production", sameSite: "strict", maxAge: 15 * 60 * 1000 });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: config.NODE_ENV === "production", sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000 });

        const safeUser: any = user.toObject();
        delete safeUser.password;
        return res.status(200).json({ ...result, data: { user: safeUser, accessToken, refreshToken } });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Verification failed"
        });
    }
};


// for change password controller 

export const changePasswordController = async (req: Request, res: Response) => {
    try {

        const email = req.user?.email;

        const { oldPassword, newPassword } = req.body;

        if (!email) {
            throw new Error("Unauthorized")
        }

        const result = await changePasswordService(email, oldPassword, newPassword);

        return res.status(200).json(result);

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "change password failed"
        });
    }
}




// for forget password controller

export const forgotPasswordController = async (req: Request, res: Response) => {
    try {

        const email = req.body?.email;

        if (!email) {
            throw new Error("Email is required")
        }

        const result = await forgotPasswordService(email);

        return res.status(200).json(result);

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "forget password failed"
        });
    }
}


// for Reset Password controller

export const resetPasswordController = async (req: Request, res: Response) => {
    try {

        const { email, newPassword, otp } = req.body;

        if (!email || !newPassword || !otp) {
            throw new Error("All fields are required")
        }

        const result = await resetPasswordService(email, newPassword, otp);

        console.log("result", result);

        return res.status(200).json(result);

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "reset password failed"
        });
    }
}

export const getSettingsController = async (req: Request, res: Response) => {
    try { return res.status(200).json({ success: true, data: await getUserSettingsService(req.user!._id) }); }
    catch (error) { return res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Unable to load settings" }); }
};

export const updateSettingsController = async (req: Request, res: Response) => {
    try { return res.status(200).json({ success: true, data: await updateUserSettingsService(req.user!._id, req.body) }); }
    catch (error) { return res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Unable to update settings" }); }
};

export const deactivateAccountController = async (req: Request, res: Response) => {
    try { return res.status(200).json({ success: true, data: await updateAccountStatusService(req.user!._id, false) }); }
    catch (error) { return res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Unable to deactivate account" }); }
};

export const deleteAccountController = async (req: Request, res: Response) => {
    try { await deleteAccountService(req.user!._id); return res.status(204).send(); }
    catch (error) { return res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Unable to delete account" }); }
};

export const getPrivacyListsController = async (req: Request, res: Response) => {
    try { return res.status(200).json({ success: true, data: await getPrivacyListsService(req.user!._id) }); }
    catch (error) { return res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Unable to load privacy lists" }); }
};

export const updatePrivacyListController = async (req: Request, res: Response) => {
    try {
        const list = req.params.list === "mutedUsers" ? "mutedUsers" : "blockedUsers";
        return res.status(200).json({ success: true, data: await updatePrivacyListService(req.user!._id, list, req.body.username, req.body.add !== false) });
    } catch (error) { return res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Unable to update privacy list" }); }
};