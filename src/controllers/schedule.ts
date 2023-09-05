import express from "express";
import Schedule from "../models/schedule";
import { ISchedule } from "../utils/InterfacesUsed";
import userLoggedIn from "../utils/UserVerified";
import { successfulRequest } from "../utils/SharedFunctions";

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
Needed: Params.id = user._id | requestorID = user._id
*/
router.post("/new", userLoggedIn, async(request: express.Request, response: express.Response) => {
    try{
        const newSchedule: ISchedule = {
            user: request.body.userID,
            group: request.body.groupID,
            assignedClockIn: [],
            assignedClockOut: [],
            userPunchIn: [],
            userPunchOut: []
        }

        const createdSchedule = await Schedule.create(newSchedule)
        if(createdSchedule){
            successfulRequest(response, "Successful Schedule Creation")
        }

    }catch(error){
        failedRequest(response, "Failed Schedule Creation", "Unable To Create Schedule", {error})
    }
})

export default router
