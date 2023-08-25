import * as express from "express";
import QRCode from "../models/qrCode";

const router: express.Router = express.Router()

router.get("/", async(request: express.Request, response: express.Response) => {
    const qrData = await QRCode.find({})
    console.log(qrData)
    console.log(request.body)
    response.status(200).json({
        page: "QRRouter",
        status: "Reached Successfully"
    })
})

export default router