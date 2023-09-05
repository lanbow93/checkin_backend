import express from "express";
import Schedule from "../models/schedule";

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

con

export default router
