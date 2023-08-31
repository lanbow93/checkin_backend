import express from "express";
import QRCode from "../models/qrCode";
import { IQRCode, IQRCodeObject } from "../utils/InterfacesUsed";
import userLoggedIn from "../utils/UserVerified";
import crypto from "crypto"
import { successfulRequest, failedRequest } from "../utils/SharedFunctions";

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
/* 
Purpose: Generate a new QR Document
Needed: groupID = Group._id QR is for | adminID = user._id
*/
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

/* 
Purpose: Verify Scanned QR and send success or fail
NEED TO COMPLETE NEW SCHEDULE GENERATION FIRST
/
*/
// router.get("/verify", userLoggedIn, async (request: express.Request, response: express.Response) => {

// })

/*
Purpose: Used to delete a QR Document
Needed: Params.id = QR._id |  Query.requestorID = user._id
*/
router.delete("/:id", userLoggedIn, async (request: express.Request, response: express.Response) => {
    try {
        const qrToDelete: IQRCodeObject | null = await QRCode.findById(request.params.id)
        if(qrToDelete) {
            if(qrToDelete.controllingAdmin === request.query.requestorID){
                const deletedQR: IQRCode | null = await QRCode.findByIdAndDelete(request.params.id)
                if(deletedQR){
                    successfulRequest(response, "QR Deletion Successful", "The QR Account Was Successfully Deleted", deletedQR)
                } else {
                    failedRequest(response, "Failed Deletion By ID", "Error: Failed To Delete", "Unable To Delete")
                }
            } else {
                failedRequest(response, "Failed To Verify Admin._id", "Unable To Delete QR: No Permissions", "Unable To Delete QR")
            }
        }else {
            failedRequest(response, "Failed To Locate QR._id", "Unable To Delete QR", "Unable To Delete QR")
        }
    } catch (error) {
        const errorObject = {error}
        failedRequest(response, "Failed To Delete QR", "Unable To Delete QR", errorObject)
    }
})

export default router