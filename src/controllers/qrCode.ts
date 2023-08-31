import express from "express";
import QRCode from "../models/qrCode";
import { IQRCode, IQRCodeObject } from "../utils/InterfacesUsed";
import userLoggedIn from "../utils/UserVerified";
import crypto from "crypto"

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
router.post("/new", userLoggedIn, async (request: express.Request, response: express.Response) => {
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
/*
Purpose: Generates a random string and updates the Access Code and Time
Needed: Params.id = QR._id |  requestorID = user._id
*/
router.put("/generate/:id", userLoggedIn, async (request: express.Request, response: express.Response) => {
    try{
        const qrString: string = crypto.randomBytes(32).toString("hex")
        const qrObject: IQRCodeObject | null = await QRCode.findById(request.params.id)
        if(qrObject){
            if(qrObject.controllingAdmin === request.body.requestorID){
                qrObject.accessCode = qrString;
                qrObject.expiryTime = new Date()
                try {
                    const newQR = await QRCode.findByIdAndUpdate(request.params.id, qrObject, {new: true})
                    response.status(200).json({
                        status: "New QR Generated",
                        data: newQR
                    })
                } catch(error){
                    response.status(400).json({
                        status: "Failed To Update QR",
                        error: error
                    })
                }
            } else {
                response.status(400).json({
                    status: "Failed To Verify Controlling Admin",
                    message: "Failed To Verify Account. Delete And Generate New QR"
                })
            }
        }else{
            response.status(400).json({
                status: "Failed To Locate QR Object",
                message: "Failed To Generate QR. Need To Setup New QR"
            })
        }
    } catch(error){
        response.status(400).json({
            status: "Failed QR Generation",
            error: error
        })
    }
})


export default router