"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const qrCode_1 = __importDefault(require("../models/qrCode"));
const UserVerified_1 = __importDefault(require("../utils/UserVerified"));
const crypto_1 = __importDefault(require("crypto"));
const SharedFunctions_1 = require("../utils/SharedFunctions");
const router = express_1.default.Router();
router.get("/", async (request, response) => {
    const qrData = await qrCode_1.default.find({});
    console.log(qrData);
    console.log(request.body);
    response.status(200).json({
        page: "QRRouter",
        status: "Reached Successfully"
    });
});
router.post("/new", UserVerified_1.default, async (request, response) => {
    try {
        const newQR = {
            accessCode: "",
            expiryTime: new Date(),
            group: request.body.groupID,
            controllingAdmin: request.body.adminID
        };
        const existingMatch = await qrCode_1.default.findOne({
            group: request.body.groupID,
            controllingAdmin: request.body.adminID
        });
        if (existingMatch) {
            response.status(400).json({
                status: "Duplicate QR Code Exists",
                message: "Unable To Make QR Code"
            });
        }
        else {
            qrCode_1.default.create(newQR);
            response.status(200).json({
                status: "Successful QR Creation",
                data: newQR
            });
        }
    }
    catch (error) {
        response.status(400).json({
            status: "Failed To Create QR",
            error: error
        });
    }
});
router.put("/generate/:id", UserVerified_1.default, async (request, response) => {
    try {
        const qrString = crypto_1.default.randomBytes(32).toString("hex");
        const qrObject = await qrCode_1.default.findById(request.params.id);
        if (qrObject) {
            if (qrObject.controllingAdmin === request.body.requestorID) {
                qrObject.accessCode = qrString;
                qrObject.expiryTime = new Date();
                try {
                    const newQR = await qrCode_1.default.findByIdAndUpdate(request.params.id, qrObject, { new: true });
                    response.status(200).json({
                        status: "New QR Generated",
                        data: newQR
                    });
                }
                catch (error) {
                    response.status(400).json({
                        status: "Failed To Update QR",
                        error: error
                    });
                }
            }
            else {
                response.status(400).json({
                    status: "Failed To Verify Controlling Admin",
                    message: "Failed To Verify Account. Delete And Generate New QR"
                });
            }
        }
        else {
            response.status(400).json({
                status: "Failed To Locate QR Object",
                message: "Failed To Generate QR. Need To Setup New QR"
            });
        }
    }
    catch (error) {
        response.status(400).json({
            status: "Failed QR Generation",
            error: error
        });
    }
});
router.delete("/:id", UserVerified_1.default, async (request, response) => {
    try {
        const qrToDelete = await qrCode_1.default.findById(request.params.id);
        if (qrToDelete) {
            if (qrToDelete.controllingAdmin === request.query.requestorID) {
                const deletedQR = await qrCode_1.default.findByIdAndDelete(request.params.id);
                if (deletedQR) {
                    (0, SharedFunctions_1.successfulRequest)(response, "QR Deletion Successful", "The QR Account Was Successfully Deleted", deletedQR);
                }
                else {
                    (0, SharedFunctions_1.failedRequest)(response, "Failed Deletion By ID", "Error: Failed To Delete", "Unable To Delete");
                }
            }
            else {
                (0, SharedFunctions_1.failedRequest)(response, "Failed To Verify Admin._id", "Unable To Delete QR: No Permissions", "Unable To Delete QR");
            }
        }
        else {
            (0, SharedFunctions_1.failedRequest)(response, "Failed To Locate QR._id", "Unable To Delete QR", "Unable To Delete QR");
        }
    }
    catch (error) {
        const errorObject = { error };
        (0, SharedFunctions_1.failedRequest)(response, "Failed To Delete QR", "Unable To Delete QR", errorObject);
    }
});
exports.default = router;
//# sourceMappingURL=qrCode.js.map