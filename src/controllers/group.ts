import express from "express"
import Group from "../models/group"
import userLoggedIn from "../utils/UserVerified"
import UserAccount from "../models/userAccount"
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
    let submittedGroup = request.body.groupUserArray
    try{
        const group = await Group.findById(request.params.id)
        if(group) {
            if(group.admins.includes(request.body.requestorID)){
                for(let i=0; i<group.members.length; i++ ){
                    const currentUser = group.members[i]
                    if(!(submittedGroup.contains(currentUser))){
                        //Needed Params.id = group | userToEdit = user_id
                        const updatedUser = fetch(`http://localhost:4000/useraccount/changegroup/${'a'}`,  )
                        console.log(updatedUser)
                    }
                }
    
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
