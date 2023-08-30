import express from "express"
import Group from "../models/group"
import userLoggedIn from "../utils/UserVerified"
import UserAccount from "../models/userAccount"
import { IGroup, IGroupObject, IUserAccount, IUserAccountObject } from "../utils/InterfacesUsed"
import { Types } from "mongoose"

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

// Needed: groupName = passed groupName | userID  = user._id
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
            userAccount.adminOf.push(newGroup._id.toString())
            userAccount.groupNames.push(newGroup._id.toString())
            const newUserAccount: IUserAccountObject | null = await UserAccount.findOneAndUpdate({accountID: request.body.userID}, userAccount)
            response.json({
                status: "Successful Group Creation",
                data: {newGroup, newUserAccount}
            })
        } else {
            response.status(400).json({
                message: "Failed Group Creation",
                status: "Unable To Locate userAccount"
            })
        }
    } catch(error) {
        response.status(400).json({
            status:"Failed To Create Group",
            message: "Group Creation Failed"
        })
    }
})

// Needed: requestorID = user._id | Params.id = group._id
router.get("/:id", userLoggedIn, async (request: express.Request, response: express.Response) => {
    try{
        const group: IGroupObject | null = await Group.findById(request.params.id)
        if(group) {
            if(group.admins.includes(request.body.requestorID)){
                response.status(200).json({
                    status: "Successful GET Request",
                    data: group
                })
            } else {
                response.status(400).json({
                    status: "Failed Admin Verification",
                    message: "Failed To Get Group Informaiton"
                })
            }
        }
    }catch(error){
        response.status(400).json({
            status: "Failed To Locate Group._ID",
            error: error
        })
    }
})

// Needed Params: id = group._id | groupUserArray = new member list array | requestorID = user._id

router.put("/editmembers/:id", userLoggedIn, async (request: express.Request, response: express.Response) => {
    const submittedGroup = request.body.groupUserArray
    try{
        const group = await Group.findById(request.params.id)
        console.log({group})
        if(group) {
            if(group.admins.includes(request.body.requestorID)){
                const differences = submittedGroup.filter((userID: string) => !group.members.includes(userID));
                console.log(submittedGroup)
                console.log({differences})
                group.members = submittedGroup
                const newGroup =  await Group.findByIdAndUpdate(request.params.id, group, {new: true})
                let data: any= {newGroup}
                for(let i=0; i< differences.length; i++) {
                    console.log(i)
                    try {
                        const userID= differences[i] // User _id to change
                        console.log({userID})
                        const groupID = request.params.id // group to add/remove
                        const userAccount: IUserAccount | null = await UserAccount.findOne({accountID: userID}) //request.body.userToEdit
                        
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
                response.status(200).json({
                    status: "Successful Group Update",
                    data: data
                })
    
            } else {
                response.status(400).json({
                    status: "Unable To Locate .id In Admins",
                    message: "Failed To Update Group"
                })
            }
        } else {
            response.status(400).json({
                status: "Unable To Locate group._id",
                message: "Failed To Update Group"
            })
        }
    }catch(error){
        response.status(400).json({
            status: "Failed Group Update",
            error: error
        })
    }
})



export default router
