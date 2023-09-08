import express from "express";
import Schedule from "../models/schedule";
import { ISchedule, IScheduleQuery, IScheduleRequest, IUserAccount } from "../utils/InterfacesUsed";
import {qrVerified, userLoggedIn} from "../utils/UserVerified";
import { failedRequest, successfulRequest } from "../utils/SharedFunctions";
import UserAccount from "../models/userAccount";

const router: express.Router = express.Router()
/*
Purpose: View Schedule(s) From User Perspective
Needed: Query.targetUserID = user._id | Query.targetGroupID = group._id
*/
router.get("/", userLoggedIn, async(request: express.Request, response: express.Response) => {
    try{
        const schedule: ISchedule | null = await Schedule.findOne({user: request.query.targetUserID, group: request.query.targetGroupID})
        if(schedule){
            successfulRequest(response, "Successful Schedule Request", "Successful Retrieval", schedule)
        }else{
            failedRequest(response, "Schedule Not Found By Parameters", "Unable To Get Schedule", "Find: Schedule Not Found")
        }
    }catch(error){
        failedRequest(response, "Failed To Retrieve Schedule", "Unable To Get Schedule", {error})
    }
})
/*
Purpose: View Schedule(s) From User Perspective
Needed:  Query.requestorID = requesor._id
Optional: Query.targetGroupID = group._id | Query.targetUserID = user._id 
*/
router.get("/admin", userLoggedIn, async (request: IScheduleRequest, response: express.Response) => {
    const userID: string = request.query.targetUserID || ""
    const groupID: string = request.query.targetGroupID || ""
    const requestorID: string = request.query.requestorID 
    try{
        const adminUserAccount: IUserAccount | null = await UserAccount.findOne({accountID: requestorID})
        if(adminUserAccount){
            if(adminUserAccount.adminOf.includes(groupID) || adminUserAccount.isSiteAdmin || adminUserAccount.isScheduleAdmin){
                let scheduleQuery: IScheduleQuery = {}
                if(groupID){
                    scheduleQuery.group = groupID
                }
                if(userID && groupID || userID && (adminUserAccount.isSiteAdmin || adminUserAccount.isScheduleAdmin)){
                    scheduleQuery.user = userID
                }
                console.log(scheduleQuery)
                const schedule: ISchedule[] | null = await Schedule.find(scheduleQuery)
                if(schedule.length > 0){
                    successfulRequest(response, "Successful Schedule Fetch", "Success", schedule)
                }else {
                    failedRequest(response, "Failed To Locate By Find", "No Schedules Exist With Those Parameters", "Find Error: Not Found")
                }
            } else {
                failedRequest(response, "Unable To Locate Group In Admin List", "Unable To Find: Not Authorized", "Authorization: Admin")
            }
        }else {
            failedRequest(response, "Unable To Locate Requestor's Account", "Unable To View Schedule", "Find Error: Requestor")
        }
    }catch(error){
        failedRequest(response, "Failed Schedule Search", "Unable To View Schedule", {error})
    }
})
/*
Purpose: Create New User Schedule For Group
Needed: userID = user._id | requestorID = user._id | groupID = Group For Schedule |  clockInTimes = Array Of ClockIn Dates | clockOutTimes = Array Of ClockOut Dates
*/
router.post("/new", userLoggedIn, async(request: express.Request, response: express.Response) => {
    const userID: string = request.body.userID
    const requestorID: string = request.body.requestorID
    const groupID: string = request.body.groupID
    try{
        const adminUserAccount: IUserAccount | null = await UserAccount.findOne({accountID: requestorID})
        if(adminUserAccount){
            const clockInTimes:  ISchedule["assignedClockIn"]= request.body.clockInTimes.map((item: string) => [item, adminUserAccount.badgeName])
            const clockOutTimes: ISchedule["assignedClockOut"] = request.body.clockOutTimes.map((item: string) => [item, adminUserAccount.badgeName])
            if(adminUserAccount.adminOf.includes(groupID) || adminUserAccount.isSiteAdmin || adminUserAccount.isScheduleAdmin){
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
/*
Purpose: Adds new shifts to schedule
Needed: userID = user._id | requestorID = user._id | groupID = Group For Schedule |  clockInTimes = Array Of ClockIn Dates | clockOutTimes = Array Of ClockOut Dates
*/
router.put("/addschedule", userLoggedIn, async(request: express.Request, response: express.Response) => {
    const userID: string = request.body.userID
    const requestorID: string = request.body.requestorID
    const groupID: string = request.body.groupID
    try{
        const adminUserAccount: IUserAccount | null = await UserAccount.findOne({accountID: requestorID})
        if(adminUserAccount){
            const clockInTimes:  ISchedule["assignedClockIn"]= request.body.clockInTimes.map((item: string) => [item, adminUserAccount.badgeName])
            const clockOutTimes: ISchedule["assignedClockOut"] = request.body.clockOutTimes.map((item: string) => [item, adminUserAccount.badgeName])
            if(adminUserAccount.adminOf.includes(groupID) || adminUserAccount.isSiteAdmin || adminUserAccount.isScheduleAdmin){
                const oldSchedule: ISchedule | null = await Schedule.findOne({user: userID, group: groupID})
                if(oldSchedule){
                    oldSchedule.assignedClockIn = oldSchedule.assignedClockIn.concat(clockInTimes)
                    oldSchedule.assignedClockOut= oldSchedule.assignedClockOut.concat(clockOutTimes)
                    try{
                        const newSchedule: ISchedule | null = await Schedule.findOneAndUpdate({user: userID, group: groupID}, oldSchedule, {new: true})
                        if(newSchedule){
                            successfulRequest(response, "Successful Update", "New Schedule Has Been Recorded", newSchedule)
                        } else {
                            failedRequest(response, "Failed To Update Schedule", "Unable To Update User's Schedule", "Schedule Did Not Overrite")
                        }
                    }catch(error) {
                        failedRequest(response, "Failed Put Request", "Unable To Update Schedule", {error})
                    }
                } else{
                    failedRequest(response, "Unable To Find Old Schedule", "Failed To Update Schedule", "Find: Old Schedule")
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

/*
Purpose: Manual Update To User Schedule 
Needed: Params.id = schedule._id | requestorID = user._id | clockInTimes = Array Of ClockIn Dates | clockOutTimes = Array Of ClockOut Dates | punchInTimes = Array Of Punch In Times | punchOutTimes
*/
router.put("/update/:id", userLoggedIn, async (request: express.Request, response: express.Response) => {
    try{
        const oldSchedule: ISchedule | null = await Schedule.findById(request.params.id) 
        if(oldSchedule){
            oldSchedule.assignedClockIn = request.body.clockInTimes || oldSchedule.assignedClockIn
            oldSchedule.assignedClockIn = request.body.clockOutTimes || oldSchedule.assignedClockIn
            oldSchedule.userPunchIn = request.body.punchInTimes || oldSchedule.userPunchIn
            oldSchedule.userPunchOut = request.body.punchOutTimes || oldSchedule.userPunchOut
            
            const newSchedule: ISchedule | null = await Schedule.findByIdAndUpdate(request.params.id, oldSchedule, {new: true})
            if(newSchedule){
                successfulRequest(response, "Successful Request", "Success", newSchedule)
            }else {
                failedRequest(response, "Schedule Update Returned Nothing", "Schedule Not Updated", "Find And Update Step Failed")
            }
        }else {
            failedRequest(response, "Failed To Locate Previous Schedule", "Unable To Update Schedule", "Find: Schedule._id")
        }
    }catch(error){
        failedRequest(response, "Unable To Update Schedule", "Failed To Update", {error})
    }
})
/*
Purpose: Adds In Punch In Or Out
Needed: cookie = QRToken | 
*/
router.put("/verifiedpunch", userLoggedIn, qrVerified, async(request: express.Request, response: express.Response) => {
    
    try {
        const cookieData: any = request.cookies.QRToken
        console.log(cookieData)
    }catch(error){
        failedRequest(response, "Failed To Check In", "Unable To Check In", {error})
    }
})

export default router