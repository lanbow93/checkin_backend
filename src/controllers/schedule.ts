import express from "express";
import Schedule from "../models/schedule";
import { ISchedule, IUserAccount } from "../utils/InterfacesUsed";
import userLoggedIn from "../utils/UserVerified";
import { failedRequest, successfulRequest } from "../utils/SharedFunctions";
import UserAccount from "../models/userAccount";

const router: express.Router = express.Router()

router.get("/", async(request: express.Request, response: express.Response) => {
    const scheduleInfo = await Schedule.find({})
    console.log(scheduleInfo)
    console.log(request.body)
    response.status(200).json({
        page: "Schedule Router",
        status: "Successfully Reached"
    })
})
/*
Purpose: Create New User Schedule For Group
Needed: userID = user._id | requestorID = user._id | groupID = Group For Schedule |  clockInTimes = Array Of ClockIn Dates | clockOutTimes = Array Of ClockOut Dates | badgeName = requestor_badgeName
*/
router.post("/new", userLoggedIn, async(request: express.Request, response: express.Response) => {
    const userID: string = request.body.userID
    const requestorID: string = request.body.requestorID
    const groupID: string = request.body.groupID
    
    
    try{
        const adminUserAccount: IUserAccount | null = await UserAccount.findOne({accountID: requestorID})
        if(adminUserAccount){
            const clockInTimes: any = request.body.clockInTimes.map((item: string) => [item, adminUserAccount.badgeName])
            const clockOutTimes: any= request.body.clockOutTimes.map((item: string) => [item, adminUserAccount.badgeName])

            console.log(clockInTimes)
            if(adminUserAccount.adminOf.includes(groupID)){
                const newSchedule: ISchedule = {
                    user: userID,
                    group: groupID,
                    assignedClockIn: clockInTimes, // Might be an issue accepting date due to formatted for postman request
                    assignedClockOut: clockOutTimes,
                    userPunchIn: [],
                    userPunchOut: []
                }
                const createdSchedule: ISchedule | null = await Schedule.create(newSchedule)
                if(createdSchedule){
                    successfulRequest(response, "Successful Schedule Creation", `New Schedule Was Created`, createdSchedule)
                } else {
                    failedRequest(response, "Failed To Make Schedule", "Unable To Create Schedule", "Unknown")
                }
            } else {
                failedRequest(response, "Unable To Locate Group In Admin List", "Unable To Update: Not Authorized", "Authorization: Admin")
            }
        }else {
            failedRequest(response, "Unable To Locate Requestor's Account", "Unable To Update Schedule", "Find Error: Requestor")
        }
    }catch(error){
        failedRequest(response, "Failed Schedule Creation", "Unable To Create Schedule", {error})
    }
})

export default router
