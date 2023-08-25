import express from "express";
import UserAccount from "../models/userAccount";
import { IUserAccount } from "../utils/InterfacesUsed";

const router: express.Router = express.Router()

router.get("/", async(request: express.Request, response: express.Response) => {
    console.log(request.body);
    response.status(200).json({
        page: "UserAccount Router",
        status: "Successfully Connected"
    })
})

router.post("/new", async(request: express.Request, response: express.Response) => {
    try {
        const userAccountDetails: IUserAccount = {
            name: request.body.name,
            badgeName: request.body.badgeName,
            email: request.body.email,
            groupNames: [],
            currentTask: ["Contact Manager To Be Added To Group", "System"],
            adminOf: [],
            isSiteAdmin: false,
            isGroupAdmin: false
        }
        const newUserAccount = await UserAccount.create(userAccountDetails)
        response.status(200).json({
            message: "User Account Creation Successful",
            data: newUserAccount
        })
    } catch (error) {
        response.status(400).json({
            message: "Failed To Create User Account",
            data: error
        })
    }
})

export default router