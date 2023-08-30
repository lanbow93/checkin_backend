import express from "express";
import UserAccount from "../models/userAccount";
const router: express.Router = express.Router()

// UNSECURE TEST ROUTE THAT NEEDS TO BE DELETED
router.get("/", async(request: express.Request, response: express.Response) => {
    try {
        request.body.name = "Test"
        const userAccounts = await UserAccount.find({})
        response.status(200).json({userAccounts})
    } catch(error) {
        response.status(400).json({
            status: "Unable To Locate Any UserAccounts",
            error: error
        })
    }
})


export default router