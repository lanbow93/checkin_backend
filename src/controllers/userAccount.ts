import express from "express";
import UserAccount from "../models/userAccount";
import userLoggedIn from "../utils/UserVerified";
import { failedRequest } from "../utils/SharedFunctions";
import { IUserAccount } from "../utils/InterfacesUsed";
const router: express.Router = express.Router()


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
/*
Purpose: Creates a new user
Needed: Params.id = user_id
*/
router.get("/edit/:id", userLoggedIn, async (request: express.Request, response: express.Response) => {
    try{
        const userAccount: IUserAccount = await UserAccount.findOne({accountID: request.params.id})
        if(userAccount){
        }else {
            failedRequest(response, "Unable To Locate By accountID", "Account Doesn't Exist", "Unable To Locate")
        }
    }catch(error){
        failedRequest(response, "Unable To Retrieve UserAccount", "Unable To Retrieve Account", {error})
    }
})

export default router