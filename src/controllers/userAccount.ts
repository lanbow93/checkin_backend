import express from "express";
import UserAccount from "../models/userAccount";
import { IUserAccount } from "../utils/InterfacesUsed";
const router: express.Router = express.Router()

// UNSECURE TEST ROUTE THAT NEEDS TO BE DELETED
router.get("/", async(request: express.Request, response: express.Response) => {
    try {
        request.body.user_id = "64ee2f65860504f62c4242fe"
        const userAccounts = await UserAccount.findOne({accountID: request.body.user_id})
        response.status(200).json({userAccounts})
    } catch(error) {
        response.status(400).json({
            status: "Unable To Locate Any UserAccounts",
            error: error
        })
    }
})

//Needed Params.id = group | userToEdit = user_id
router.put("/changegroup/:id", async(request: express.Request, response: express.Response) => {
    try {
        const groupToChange = request.params.id
        const userAccount: IUserAccount | null = await UserAccount.findOne({accountID: request.body.userToEdit})
        console.log(request.body.userToEdit)
        if (userAccount) {
            // Deletes group if found in group list | Adds group if not found on group array
            if(userAccount.groupNames.includes(groupToChange)){
                userAccount.groupNames.splice(userAccount.groupNames.indexOf(groupToChange), 1)
            } else {
                userAccount.groupNames.push(groupToChange)
            }
            const newUserAccount = await UserAccount.findOneAndUpdate({accountID: request.body.userToEdit}, userAccount, {new: true})
            if(newUserAccount){
                response.status(200).json({
                    status: "Successful Group Update",
                    data: newUserAccount
                })
            } else{
                response.status(400).json({
                    status: "Failed To Locate User For Update",
                    message: "Failed To Update User Groups"
                })
            }
        } else {
            response.status(400).json({
                status: "Failed To Locate User",
                message: "Unable To Change User",
                data: userAccount
            })
        }
    }catch(error){
        response.status(400).json({
            status: "Failed To Update User Account",
            error: error
        })
    }
})

export default router