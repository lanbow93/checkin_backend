import express from "express";
import QRCode from "../models/qrCode";
import { IQRCode } from "../utils/InterfacesUsed";

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

// Needed: groupID = Group._id QR is for | adminID = user._id
router.post("/new", async (request: express.Request, response: express.Response) => {
    try{
        const newQR: IQRCode = {
            accessCode: "",
            expiryTime: new Date(),
            group: request.body.groupID,
            controllingAdmin: request.body.adminID
        }
        // Prevent duplicates
        const existingMatch: IQRCode | null = await QRCode.findOne({
            group: request.body.groupID, 
            controllingAdmin: request.body.adminID
        })

        if(existingMatch) {
            response.status(400).json({
                status: "Duplicate QR Code Exists",
                message: "Unable To Make QR Code"
            })
        } else {
            QRCode.create(newQR)
            response.status(200).json({
                status: "Successful QR Creation",
                data: newQR
            })
        }


        
    } catch(error) {
        response.status(400).json({
            status: "Failed To Create QR",
            error: error
        })
    }
})



export default router