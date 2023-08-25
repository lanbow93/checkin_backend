import express from "express";
import User from "../models/user";
import bcrypt from "bcryptjs"
import { IUser } from "../utils/InterfacesUsed";

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
        // Hash password
        request.body.password = await bcrypt.hash(request.body.password, await bcrypt.genSalt(10))

        //generate user from received data
        const user = await User.create(request.body)
        response.status(200).json{
            message: "User Created",
            data: user
        }
    }
})

export default router