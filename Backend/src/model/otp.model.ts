import mongoose from "mongoose"
import type { OtpBody } from "../types/otp/otp.types.js"


const otpSchema = new mongoose.Schema<OtpBody>({

    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    otp: String,
    expiresAt: Date,
    isVerified: Boolean,

    attempts: {
        type: Number,
        default: 0
    },
    requestCount: {
        type: Number,
        default: 0
    },
    firstRequestTime: {
        type: Number,
        default: 0
    },

   type: {
  type: String,
  enum: ["verify-email", "reset-password"],
  required: true
}
})

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const otpModel = mongoose.model("otp",otpSchema)

export default otpModel