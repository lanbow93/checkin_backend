import express from "express";
const router: express.Router = express.Router()

router.get("/", async(request: express.Request, response: express.Response) => {
    console.log(request.body);
    response.status(200).json({
        page: "UserAccount Router",
        status: "Successfully Connected"
    })
})


export default router