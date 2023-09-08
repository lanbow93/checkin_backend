import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const SECRET = process.env.SECRET || ""



export async function userLoggedIn  (request: any, response: Response, next: NextFunction){
    try {
        // Check if token is in the cookies
        const { token = false} = request.cookies;
        if (token) {
            // Verify token
            const payload = await jwt.verify(token, SECRET);
            // Add payload to request
            request.payload = payload;
            next()
        } else {
            throw "Not logged In"
        }
    } catch (error) {
        response.status(400).json({
            message: "Failed User Verification",
            status: "User Cookie Not Verified"
        })
    }
}
