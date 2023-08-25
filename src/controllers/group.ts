import * as express from "express"
import Group from "../models/group"

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


export default router
