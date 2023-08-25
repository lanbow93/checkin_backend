import express from "express";
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
// Model & Type Imports
import User from "../models/user";
// import UserAccount from "../models/userAccount";
import { IUser } from "../utils/InterfacesUsed";

dotenv.config()

const router: express.Router = express.Router()

// Test Route
router.get("/", async (request: express.Request, response: express.Response) => {
    console.log(request.body)
    response.status(200).json({
        page: "AuthRouter",
        status: "Successfully Reached"
    })
})

router.post("/signup", async (request: express.Request, response: express.Response) => {
    try {
        // Hash password
        request.body.password = await bcrypt.hash(request.body.password, await bcrypt.genSalt(10))
        const userObject: IUser = {
            username: request.body.username.toLowerCase(),
            password: request.body.password,
            email: request.body.email.toLowerCase(),
            resetToken: "",
            resetTokenExpiry: new Date()
        }
        
        //generate user from received data
        const user: IUser = await User.create(userObject)
        response.status(200).json({
            message: "User Created",
            data: user
        })
    } catch(error){
        response.status(400).json({
            message: "User Creation Failed",
            data: error
        })
    }
})

router.post("/login", async(request: express.Request, response: express.Response) => {
    try {
        console.log(request.body)
    } catch(error) {
        response.status(400).json({
            message: "Failed to Login",
            data: error
        })
    }
})

export default router