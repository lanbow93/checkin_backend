import * as express from "express";
import User from "../models/user";

const router: express.Router = express.Router()


router.get("/", async (request: express.Request, response: express.Response) => {
    const allUsers = User.find({})
    console.log(allUsers)
    console.log(request.body)
    response.status(200).json({
        page: "AuthRouter",
        status: "Successfully Reached"
    })
})

export default router