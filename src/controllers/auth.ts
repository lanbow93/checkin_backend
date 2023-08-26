import express from "express";
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
// import nodemailer from "nodemailer"

// Model & Type Imports
import User from "../models/user";
// import UserAccount from "../models/userAccount";
import { IUser, IUserAccount } from "../utils/InterfacesUsed";
import UserAccount from "../models/userAccount";

dotenv.config()

const router: express.Router = express.Router()

const SECRET: string = process.env.SECRET || ""

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
        // Just to have name in proper case
        request.body.name = request.body.name.toLowerCase().replace(/(?:^|\s|')\w/g, (m: string) => m.toUpperCase());
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

        const userAccountDetails: IUserAccount = {
            name: request.body.name,
            badgeName: request.body.badgeName,
            email: request.body.email.toLowerCase(),
            groupNames: [],
            currentTask: ["Contact Manager To Be Added To Group", "System"],
            adminOf: [],
            isSiteAdmin: false,
            isGroupAdmin: false,
            isScheduleAdmin: false
        }

        const newUserAccount = await UserAccount.create(userAccountDetails)

        response.status(200).json({message: "User Created",data:{user: user, accountData: newUserAccount}})

    } catch(error){
        response.status(400).json({
            message: "User Creation Failed",
            data: error
        })
    }
})

router.post("/login", async(request: express.Request, response: express.Response) => {
    try {
        request.body.username = request.body.username.toLowerCase()
        const {username, password} = request.body
        
        // Searching collection for username
        const user = await User.findOne({username})
        // If user exists checks for password
        if (user){
            const passwordCheck: boolean = await bcrypt.compare(password, user.password)
            if(passwordCheck){
                const payload: object = {username}
                const token = await jwt.sign(payload, SECRET)
                response.cookie("token", token, {
                    httpOnly: true,
                    path:"/",
                    sameSite: "none",
                    secure: request.hostname === "localhost" ? false : true
                }).json({payload, status: "logged in"})
            } else {
                response.status(400).json({
                    message: "Username/Password is incorrect",
                    status: "Failed Pass Check"
                })
            }
        } else {
            response.status(400).json({
                message: "Username/Password is incorrect",
                status: "Failed User Check"
            })
        }
        
    } catch(error) {
        response.status(400).json({
            message: "Failed to Login",
            data: error
        })
    }
})

router.post("/forgotpassword", async (request: express.Request, response: express.Response) => {
    try {
        request.body.email = request.body.email.toLowerCase()
        const user = await User.findOne({email: request.body.email})
        if(user) {
            response.status(200).json({
                message: "Successfully found email",
                data: user
            })
        } else {
            response.status(200).json({
                message: "Email Does Not Exist",
                status: "Email Check Failed"
            })
        }
    }catch(error){
        response.status(400).json({
            message: "Email Does Not Exist",
            data: error
        })
    }
})

export default router