import express from "express";
import User from "../models/user";
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import { IUser } from "../utils/InterfacesUsed";
dotenv.config()

const router: express.Router = express.Router()


router.get("/", async (request: express.Request, response: express.Response) => {
    const allUsers = User.find({})
    console.log(allUsers)
    console.log(request.body)
    response.status(200).json({
        page: "AuthRouter",
        status: "Successfully Reached"
    })
})

router.post("/signup", async (request: express.Request, response: express.Response) => {
    try {

        // Setting reset Token and expiry to not need to be passed by frontend
        request.body.resetToken = "";
        request.body.resetTokenExpiry = new Date()
        // removing case sensivity from username
        request.body.username = request.body.username.toLowerCase()
        // Hash password
        request.body.password = await bcrypt.hash(request.body.password, await bcrypt.genSalt(10))

        //generate user from received data
        const user: IUser = await User.create(request.body)
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

export default router