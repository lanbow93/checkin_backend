import * as express from "express";
import UserAccount from "../models/userAccount";

const router: express.Router = express.Router()

router.get("/", async(request: express.Request, response: express.Response) => {
    const userAccountData = await UserAccount.find({});
    console.log(userAccountData);
    console.log(request.body);
    response.status(200).json({
        page: "UserAccount Router",
        status: "Successfully Connected"
    })

})

export default router