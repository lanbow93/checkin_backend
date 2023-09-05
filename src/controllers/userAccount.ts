import express from "express";
import UserAccount from "../models/userAccount";
import userLoggedIn from "../utils/UserVerified";
import { failedRequest, successfulRequest } from "../utils/SharedFunctions";
import { IUserAccount, IUserAccountObject } from "../utils/InterfacesUsed";
import mongoose from "mongoose";
import Group from "../models/group";
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
Purpose: Get's User Specific Account Information
Needed: Params.id = user._id | requestorID = user._id
*/
router.get("/edit/:id", userLoggedIn, async (request: express.Request, response: express.Response) => {
    try{
        const userAccount: IUserAccount | null = await UserAccount.findOne({accountID: request.params.id})
        if(userAccount){
            if(userAccount.accountID === request.body.requestorID){
                successfulRequest(response, "Successful Request", "Success", userAccount)
            }else {
                failedRequest(response, "User._id && Requestor._id Don't Match", "Unable To Access Records", "Authorization Failed")
            }
        }else {
            failedRequest(response, "Unable To Locate By accountID", "Account Doesn't Exist", "Unable To Locate")
        }
    }catch(error){
        failedRequest(response, "Unable To Retrieve UserAccount", "Unable To Retrieve Account", {error})
    }
})
/*
Purpose: Updates The User Details
Needed: Params.id = UserAccount._id | requestorID = user_id
*/ 
router.put("/updatedetails/:id", userLoggedIn, async (request: express.Request, response: express.Response) => {
    try{
        const oldAccount: IUserAccountObject | null = await UserAccount.findById(request.params.id)
        if(oldAccount){
            if(oldAccount.accountID === request.body.requestorID){
                const newAccount: IUserAccountObject = {
                    name: request.body.name || oldAccount.name,
                    createdAt: oldAccount.createdAt,
                    updatedAt: oldAccount.updatedAt,
                    _id: oldAccount._id,
                    badgeName: request.body.badgeName || oldAccount.badgeName,
                    email: request.body.email || oldAccount.email, 
                    groupNames: oldAccount.groupNames,
                    currentTask: request.body.currentTask || oldAccount.currentTask,
                    adminOf:  oldAccount.adminOf,
                    accountID: oldAccount.accountID,
                    isSiteAdmin: oldAccount.isSiteAdmin,
                    isGroupAdmin: oldAccount.isGroupAdmin,
                    isScheduleAdmin: oldAccount.isScheduleAdmin
                }
                try{
                    const updatedAccount: IUserAccountObject | null = await UserAccount.findByIdAndUpdate(request.params.id, newAccount, {new: true})
                    if(updatedAccount){
                        successfulRequest(response, "Successful Update", "Account Update Successful", updatedAccount)
                    }else {
                        failedRequest(response, "Failed Update Response", "Unable To Update Account", "Account Update Failed")
                    }
                }catch(error){
                    failedRequest(response, "Failed Update Try Attempt", "Unable To Update Account", {error})
                }
            }else{
                failedRequest(response, "Unable To Verify Requestor Id", "Failed To Update", "Authorization Error")
            }
        }else{
            failedRequest(response, "Failed To Locate Group._id", "Unable To Update", "Group Doesn't Exist")
        }
    }catch(error){
        failedRequest(response, "Unable To Retrieve Record", "Failed To Update Account", {error})
    }
})
/*
Purpose: Updates The User Task
Needed: Params.id = UserAccount._id To Search| requestorID = user_id
*/
router.put("/task/:id",userLoggedIn, async (request: express.Request, response: express.Response) => {
    try{
        const userAccountToCompare: IUserAccountObject | null = await UserAccount.findById(request.params.id)
        if(userAccountToCompare){
            console.log("reached")
            const groupsToCheck = await Group.find({
                '_id': { $in: userAccountToCompare.groupNames.map((group_id) => new mongoose.Types.ObjectId(group_id))}
            })
            console.log({groupsToCheck})
            response.json(groupsToCheck)

        }else {
            failedRequest(response, "Failed To Locate UserAccount._id", "Failed To Update: Unable To Locate User", "Find Error")
        }
    }catch(error){
        failedRequest(response, "Failed Task Update", "Unable To Update User's Task", {error})
    }
})



export default router