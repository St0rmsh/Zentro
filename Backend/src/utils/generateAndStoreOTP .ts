import otpModel from "../model/otp.model.js";
import otpGenerate from "./otp.js";



export const generateAndStoreOTP = async (
    email: string,
    type: "verify-email" | "reset-password"
) => {
    const otp = otpGenerate();

    await otpModel.findOneAndUpdate(
        { email },
        {
            email,
            otp,
            expiresAt: new Date(
                Date.now() + 10 * 60 * 1000
            ),
            attempts: 0
        },
        {
            upsert: true,
            new: true
        }
    );

    return otp;
};