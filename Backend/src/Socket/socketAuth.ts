import jwt from "jsonwebtoken";
import config from "../config/config.js";
import type { ExtendedError } from "socket.io";
import cookie from "cookie";

export const socketAuth = (socket: any,next: (err?: ExtendedError) => void) => {

    try {
        const cookies = cookie.parse(socket.handshake.headers.cookie || "");
        const token = socket.handshake.auth.token || cookies.accessToken;

        if (!token) {
            return next(new Error("Unauthorized"));
        }

        const decoded = jwt.verify(
            token,
            config.ACCESS_TOKEN
        ) as {
            _id: string;
        };

        socket.data.userId = decoded._id;

        next();

    } catch {

        next(new Error("Unauthorized"));

    }

};