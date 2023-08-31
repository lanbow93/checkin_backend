import express from "express"
import Group from "../models/group"
import userLoggedIn from "../utils/UserVerified"
import UserAccount from "../models/userAccount"
import { IGroup, IGroupObject, IUserAccount, IUserAccountObject } from "../utils/InterfacesUsed"
import { Types } from "mongoose"
import { successfulRequest, failedRequest } from "../utils/SharedFunctions"

const router: express.Router = express.Router()

router.get("/", async(request: express.Request, response: express.Response) => {
    const groupDate = Group.find({})
    console.log({groupDate})
    console.log(request.body)
    response.status(200).json({
        page: "GroupRouter",
        status: "Successfully Reached"
    })
})

/*
Purpose: Creates a New Group, Adds User As Member && Admin | Updates userAccount with Member & Admin 
Needed: groupName = passed groupName | userID  = user._id
*/
router.post("/new", userLoggedIn, async (request: express.Request, response: express.Response) => {
    try{
        const userAccount: IUserAccountObject | null = await UserAccount.findOne({accountID: request.body.userID})
        if (userAccount) {
            const group: IGroup = {
                groupName: request.body.groupName,
                admins:[request.body.userID],
                members: [request.body.userID]
            }
            interface ICreationGroup extends IGroup {_id:  Types.ObjectId }
            const newGroup: ICreationGroup | null = await Group.create(group)
            if(newGroup){
                userAccount.adminOf.push(newGroup._id.toString())
                userAccount.groupNames.push(newGroup._id.toString())
                const newUserAccount: IUserAccountObject | null = await UserAccount.findOneAndUpdate({accountID: request.body.userID}, userAccount)
                if(newUserAccount){
                    successfulRequest(response, "Successful Group Creation", `New Group Created With ${userAccount.badgeName} As Admin`, {newGroup, newUserAccount} )
                } else {
                    failedRequest(response, "Failed To Update User Account", "Failed Group Creation", "Error Unknown")
                }
            } else {
                failedRequest(response, "Failed To Create New Group", "Unable To Create New Group", "Error Unknown")
            }
        } else {
            failedRequest(response, "Failed Group Creation", "Unable To Locate Account", "Unable To Find UserAccount")
        }
    } catch(error) {
        failedRequest(response, "Failed To Create Group", "Group Creation Failed", "Unable To Create Group: Unknown")
    }
})
/*
Purpose: Used To Get Details Of Group
Needed: requestorID = user._id | Params.id = group._id
*/
router.get("/:id", userLoggedIn, async (request: express.Request, response: express.Response) => {
    try{
        const group: IGroupObject | null = await Group.findById(request.params.id)
        if(group) {
            if(group.admins.includes(request.body.requestorID)){
                successfulRequest(response, "Successful Get Request", "Request Successful", group)
            } else {
                failedRequest(response, "Failed Admin Verification", "Failed To Get Group Information", "Not An Admin")
            }
        }
    }catch(error){
        failedRequest(response, "Failed To Locate Group._ID", "Unable To View Group", {error})
    }
})
/*
Purpose: Used To Add/Remove Members from group | adds/removes Group from userAccount |
Needed: Params: id = group._id | groupUserArray = new member list array | requestorID = user._id
*/
router.put("/editmembers/:id", userLoggedIn, async (request: express.Request, response: express.Response) => {
    const submittedGroup: IGroup["members"] = request.body.groupUserArray
    try{
        const group = await Group.findById(request.params.id)
        if(group) {
            if(group.admins.includes(request.body.requestorID)){
                // Creates a variable that is set to the comparisons between the old array and new array before altering
                const differences = submittedGroup.filter((userID: string) => !group.members.includes(userID));
                group.members = submittedGroup
                try{
                    const newGroup =  await Group.findByIdAndUpdate(request.params.id, group, {new: true})
                    let data: any= {newGroup}
                    for(let i=0; i< differences.length; i++) {
                        try {
                            const userID= differences[i] // User _id to change
                            const groupID = request.params.id // group to add/remove
                            const userAccount: IUserAccount | null = await UserAccount.findOne({accountID: userID}) 
                            if (userAccount) {
                                // Deletes group if found in group list | Adds group if not found on group array
                                if(userAccount.groupNames.includes(groupID)){
                                    userAccount.groupNames.splice(userAccount.groupNames.indexOf(groupID), 1)
                                } else {
                                    userAccount.groupNames.push(groupID)
                                }
                                const updatedAccount = await UserAccount.findOneAndUpdate({accountID: userID}, userAccount, {new: true})
                                data[`variable[${i}]`]= updatedAccount
                            }
                        }catch(error){
                            response.status(400).json({
                                status: "Failed To Update User Account",
                                error: error
                            })
                        }
                    }
                    successfulRequest(response, "Successful Group Update", "Successfully Updated Members", data)
                } catch(error){
                    failedRequest(response, "Failed Before Loop", "Failed Group Update: Unknown", "Failed To Update Group" )
                }
            } else {
                failedRequest(response, "Unable To Locate _ID In Admins", "Failed To Update Group: Admin Permission Issue", "Not An Admin Of Group")
            }
        } else {
            failedRequest(response, "Unable To Locate Group._ID", "Failed To Update Group", "Group._ID Not Located")
        }
    }catch(error){
        failedRequest(response, "Failed Group Update", "Failed To Update Members", {error} )
    }
})
/*
Purpose: Used To Add/Remove Admins from group | adds Group to userAccount if not there |
Needed: Params: id = group._id | adminUserArray = new member list array | requestorID = user._id
*/
router.put("/editadmins/:id", userLoggedIn, async (request: express.Request, response: express.Response) => {
    const submittedGroup = request.body.adminUserArray
    try{
        const group = await Group.findById(request.params.id)
        if(group) {
            if(group.admins.includes(request.body.requestorID)){
                const differences: [string] = submittedGroup.filter((userID: string) => !group.admins.includes(userID));
                group.admins = submittedGroup
                let data: any= {}
                for(let i=0; i< differences.length; i++) {
                    try {
                        const userID = differences[i] // User _id to change
                        const groupID = request.params.id // group to add/remove
                        const userAccount: IUserAccount | null = await UserAccount.findOne({accountID: userID}) //request.body.userToEdit
                        if (userAccount) {
                            // Deletes group if found in group list | Adds group if not found on group array in all areas
                            if(userAccount.adminOf.includes(groupID)){
                                userAccount.adminOf.splice(userAccount.adminOf.indexOf(groupID), 1)
                            } else {
                                userAccount.adminOf.push(groupID)
                                if(!userAccount.groupNames.includes(groupID)){
                                    userAccount.groupNames.push(groupID)
                                    group.members.push(groupID)
                                }
                            }
                            const updatedAccount = await UserAccount.findOneAndUpdate({accountID: userID}, userAccount, {new: true})
                            data[`variable[${i}]`]= updatedAccount
                        }
                    }catch(error){
                        failedRequest(response, "Failed To Update User Account", "Failed User Group Update", {error})
                        break
                    }
                }
                const newGroup: IGroup | null =  await Group.findByIdAndUpdate(request.params.id, group, {new: true})
                if(newGroup){
                    data.newGroup = newGroup
                    successfulRequest(response, "Successful Admin Update", "Admin Record Changed Successfully", data)
                } else {
                    failedRequest(response, "Failed On Group Update Attempt", "Unable To Update Admin List", "Failed During Grop Update")
                }
            } else {
                failedRequest(response, "Unable To Locate .id In Admins", "Failed To Update Admin", "No Admin Permissions")
            }
        } else {
            failedRequest(response, "Unable To Locate Group._ID", "Failed To Update Admin", "Unable To Locate Group")
        }
    }catch(error){
        failedRequest(response, "Failed Admin Update", "Unable To Update Admin List", {error})
    }
})
/*
Purpose: Used To Add/Remove Admins from group | adds Group to userAccount if not there 
Needed: Needed Params: id = group._id | Query.requestorID = user._id
*/
router.delete("/:id", userLoggedIn, async (request: express.Request, response: express.Response) => {
    const requestorID: string = request.query.requestorID?.toString() || ""
    try{
        const groupToDelete: IGroup | null = await Group.findById(request.params.id)
        if(groupToDelete){
            if(groupToDelete.admins.includes(requestorID)){
                const deletedGroup = await Group.findByIdAndDelete(request.params.id)
                let data: any = {deletedGroup:  deletedGroup}
                for(let i=0; i< groupToDelete.members.length; i++){
                    const accountToModify = await UserAccount.findOne({accountID: groupToDelete.members[i]})
                    if(accountToModify){
                        // If in adminlist, remove
                        if(accountToModify.adminOf.includes(request.params.id)){
                            accountToModify.adminOf.splice(accountToModify.adminOf.indexOf(request.params.id), 1)
                        }
                        accountToModify.groupNames.splice(accountToModify.groupNames.indexOf(request.params.id), 1)
                        // Updating account with info removed
                        const newAccount = await UserAccount.findOneAndUpdate({accountID: groupToDelete.members[i]}, accountToModify, {new: true})
                        data[`user${i}`] = newAccount
                    }
                    if(i === groupToDelete.members.length - 1){
                        successfulRequest(response, "Group Deletion Successful", `Successfully Deleted Group ${groupToDelete.groupName}`, data)
                    }
                }
            }
        }else {
            failedRequest(response, "Unable To Locate Group._ID", "Failed To Delete Group", "Group.ID Issue")
        }
    }catch(error){
        failedRequest(response, "Failed To Delete Group", "Failed To Delete Group", {error})
    }
})

export default router
