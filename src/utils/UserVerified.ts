import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const SECRET = process.env.SECRET || ""
const VSECRET = process.env.VSECRET || ""



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

export async function qrVerified  (request: any, response: Response, next: NextFunction){
    try {
        // Check if token is in the cookies
        const { QRtoken = false} = request.cookies;
        if (QRtoken) {
            // Verify token
            const payload = await jwt.verify(QRtoken, VSECRET);
            // Add payload to request
            request.payload = payload;
            next()
        } else {
            throw "QR Not Verified/Expired"
        }
    } catch (error) {
        response.status(400).json({
            message: "Failed QR Verification",
            status: "User QR Not Verified/Expired"
        })
    }
}
