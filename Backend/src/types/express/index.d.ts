import { JwtPayload } from "jsonwebtoken";

export {};


declare global {
  namespace Express {
    interface User {
      _id: any;
      email?: string;
      roles?: ("user" | "author" | "admin")[];
    }
  }
}