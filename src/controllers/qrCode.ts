import express from "express";
import QRCode from "../models/qrCode";
import { IQRCode, IQRCodeObject } from "../utils/InterfacesUsed";
import userLoggedIn from "../utils/UserVerified";
import crypto from "crypto"
import { successfulRequest, failedRequest } from "../utils/SharedFunctions";

const router: express.Router = express.Router()

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
            failedRequest(response, "Duplicate QR Code Exists", "QR Already Exists. Go To QR and Generate", "Unable To Make QR: Duplicate")
        } else {
            const createdQR: IQRCode | null = await QRCode.create(newQR)
            if(createdQR){
                successfulRequest(response, "Successful QR Generation", "New QR Account Made", createdQR)
            } else {
                failedRequest(response, "Failed To Generate New QR", "Unable To Generate QR", "Unable To Generate QR: Unknown")
            }
        }
    } catch(error) {
        failedRequest(response, "Failed To Create", "Unable To Create QR", {error})
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
                    const newQR: IQRCode | null = await QRCode.findByIdAndUpdate(request.params.id, qrObject, {new: true})
                    if(newQR){
                        successfulRequest(response, "New QR Generated", "New QR Code Generated", newQR)
                    } else {
                        failedRequest(response, "Failed To Get Response Back", "Unable To Update QR", "Unable To Update QR")
                    }
                } catch(error){
                    failedRequest(response, "Failed To Find & Update QR by ._id", "Unable To Update QR", {error})
                }
            } else {
                failedRequest(response, "Failed To Verify Controlling Admin", "Failed To Verify Account. Delete And Generate New QR", "Failed To Verify Account")
            }
        }else{
            failedRequest(response, "Failed To Locate QR Object By ._id", "Failed TO Generate QR. Need To Setup New QR", "Unable to Locate QR")
        }
    } catch(error){
        failedRequest(response, "Failed QR Generation", "Unable To Generate QR Code", {error})
    }
})
/* 
Purpose: Verify Scanned QR and send success or fail
Needed:  groupID = group_id | codeToVerify = accessCode
/
*/
router.get("/verify", userLoggedIn, async (request: express.Request, response: express.Response) => {
    try{
        const qrToCompare: IQRCodeObject | null = await QRCode.findOne({
            group: request.body.groupID,
            accessCode: request.body.codeToVerify
        })
        if(qrToCompare){
            const timeDifference = Math.abs(new Date().getTime() - qrToCompare.expiryTime.getTime() ); // Difference in milliseconds
            const fiveMinutesInMilliseconds = 5 * 60 * 1000; // 5 minutes in milliseconds
            const isMoreThanFiveMinutes = timeDifference > fiveMinutesInMilliseconds;
            if(!isMoreThanFiveMinutes){
                successfulRequest(response, "Successful Request", "QR Verified: Proceed To Time Punch", qrToCompare)                
            }else {
                failedRequest(response, "Expiry Token Past 5 Minutes", "Expired Token. Generate New QR And Try Again", "Expired Token")
            }
        } else {
            failedRequest(response, "Failed To Find By Group ID && Access Code", "Unable To Verify QR", "QR Find Failed")
        }
    }catch(error) {
        failedRequest(response, "Unable To Locate QR", "Unable To Verify: Try Again", {error})
    }
})
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
        failedRequest(response, "Failed To Delete QR", "Unable To Delete QR", {error})
    }
})

export default router