
export interface OtpBody {
    email: string,
    otp: string,
    expiresAt: Date,
    isVerified: boolean,
    attempts: number,
    requestCount: number,
    firstRequestTime: number
    type: string
}