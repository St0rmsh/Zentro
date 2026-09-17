import type { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";


const handleValidationErrors = (req:Request,res:Response,next:NextFunction)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next()
}

export const registerValidator = [
    body('fullname')
    .trim()
    .notEmpty()
    .isLength({min:3})
    .isLength({max:30})
    .withMessage("Fullname must be a string and at least 3 characters long"),

    
    body('email')
    .trim()
    .notEmpty()
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid Email"),
    
    body('password')
    .trim()
    .notEmpty()
    .isLength({min:6})
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
    .withMessage("Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
    
    body('username')
    .trim()
    .notEmpty()
    .toLowerCase()
    .isLength({min:3})
    .isLength({max:30})
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username must be a string and at least 3 characters long and contains only letters, numbers and underscores and max length is 30"),

    handleValidationErrors
]

export const loginValidator = [
    body('email')
    .trim()
    .notEmpty()
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid Email"),
    
    body('password')
    .trim()
    .notEmpty()
    .isLength({min:6})
    .withMessage("Password must be at least 6 characters long"),

    handleValidationErrors
]

export const resetPasswordValidator = [
    body('email')
    .trim()
    .notEmpty()
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid Email"),
    
    body('newPassword')
    .trim()
    .notEmpty()
    .isLength({min:6})
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
    .withMessage("Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
    
    body('otp')
    .trim()
    .notEmpty()
    .withMessage("OTP is required"),

    handleValidationErrors
]