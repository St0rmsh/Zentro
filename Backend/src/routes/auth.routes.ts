import express from "express";
import { registerValidator, loginValidator, resetPasswordValidator } from "../validation/auth.validation.js";
import { deactivateAccountController, deleteAccountController, getPrivacyListsController, getSettingsController, getUser, loginController, logoutController, refreshAccessTokenController, registrationController, updatePrivacyListController, updateSettingsController, updateUserController, verifyOtpController, sendOtpController, changePasswordController, resetPasswordController, forgotPasswordController } from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import passport from "../config/passport.js";
import { oauthCallbackController } from "../controller/auth.controller.js";
import uploadFile from "../middleware/multer.js";

const authRouter = express.Router()

authRouter.get("/google", (req, res, next) => {
	if (!process.env.GOOGLE_CLIENT_ID) return res.redirect(`${process.env.FRONTEND_ORIGIN || "http://localhost:5173"}/auth/login?oauth=unavailable`);
	passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});
authRouter.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: `${process.env.FRONTEND_ORIGIN || "http://localhost:5173"}/auth/login?oauth=failed` }), oauthCallbackController);
authRouter.get("/github", (req, res, next) => {
	if (!process.env.GITHUB_CLIENT_ID) return res.redirect(`${process.env.FRONTEND_ORIGIN || "http://localhost:5173"}/auth/login?oauth=unavailable`);
	passport.authenticate("github", { scope: ["user:email"] })(req, res, next);
});
authRouter.get("/github/callback", passport.authenticate("github", { session: false, failureRedirect: `${process.env.FRONTEND_ORIGIN || "http://localhost:5173"}/auth/login?oauth=failed` }), oauthCallbackController);



//@Method         POST
//@Route          /api/auth/register
//@Description    Register a new user
//@Access         Public
authRouter.post("/register", registerValidator, registrationController)




//@Method         POST
//@Route          /api/auth/login
//@Description    Login a new user
//@Access         Public
authRouter.post("/login", loginValidator, loginController)




//@Method         GET
//@Route          /api/auth/me
//@Description    Get current user profile
//@Access         Private
authRouter.get("/me", authMiddleware, getUser)

authRouter.get("/settings", authMiddleware, getSettingsController)
authRouter.patch("/settings", authMiddleware, updateSettingsController)
authRouter.patch("/deactivate", authMiddleware, deactivateAccountController)
authRouter.delete("/account", authMiddleware, deleteAccountController)
authRouter.get("/privacy-lists", authMiddleware, getPrivacyListsController)
authRouter.patch("/privacy-lists/:list", authMiddleware, updatePrivacyListController)




//@Method         POST
//@Route          /api/auth/refresh-access-token
//@Description    Refresh access token
//@Access         Public
authRouter.post("/refresh-access-token", refreshAccessTokenController)




//@Method         POST
//@Route          /api/auth/logout
//@Description    Logout a user
//@Access         Private
authRouter.post("/logout", authMiddleware, logoutController)




//@Method         PATCH
//@Route          /api/auth/update-profile
//@Description    Update user profile
//@Access         Private
authRouter.patch("/update-profile", authMiddleware, uploadFile.fields([{ name: "avatar", maxCount: 1 },
{ name: "banner", maxCount: 1 }]), updateUserController)




//@Method         POST
//@Route          /api/auth/send-otp
//@Description    Send OTP to user
//@Access         Private
authRouter.post("/send-otp", sendOtpController)




//@Method         POST
//@Route          /api/auth/verify-otp
//@Description    Verify OTP
//@Access         Private
authRouter.post("/verify-otp", verifyOtpController)



//@Method        PATCH
//@Route          /api/auth/change-password
//@Description    Change user password
//@Access         Private
authRouter.patch("/change-password", authMiddleware, changePasswordController)



//@Method        POST
//@Route          /api/auth/forgot-password
//@Description    Forget user password
//@Access         Private
authRouter.post("/forgot-password", forgotPasswordController)


//@Method        POST
//@Route          /api/auth/reset-password
//@Description    Reset user password
//@Access         Private
authRouter.post("/reset-password", resetPasswordValidator, resetPasswordController)




export default authRouter