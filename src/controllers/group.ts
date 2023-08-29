import express from "express"
import Group from "../models/group"
import userLoggedIn from "../utils/UserVerified"
import UserAccount from "../models/user"
import { IGroup, IGroupObject, IUserAccountObject } from "../utils/InterfacesUsed"

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
                admins:[userAccount._id],
                members: [userAccount._id]
            }
            const newGroup: IGroup = await Group.create(group)
            response.json({
                status: "Successful Group Creation",
                data: newGroup
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
            if(group.admins.indexOf(request.body.requestorID) !== -1){
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
            data: error
        })
    }
})



export default router
