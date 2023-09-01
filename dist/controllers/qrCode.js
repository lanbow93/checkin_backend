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
            (0, SharedFunctions_1.failedRequest)(response, "Duplicate QR Code Exists", "QR Already Exists. Go To QR and Generate", "Unable To Make QR: Duplicate");
        }
        else {
            const createdQR = await qrCode_1.default.create(newQR);
            if (createdQR) {
                (0, SharedFunctions_1.successfulRequest)(response, "Successful QR Generation", "New QR Account Made", createdQR);
            }
            else {
                (0, SharedFunctions_1.failedRequest)(response, "Failed To Generate New QR", "Unable To Generate QR", "Unable To Generate QR: Unknown");
            }
        }
    }
    catch (error) {
        (0, SharedFunctions_1.failedRequest)(response, "Failed To Create", "Unable To Create QR", { error });
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
                    if (newQR) {
                        (0, SharedFunctions_1.successfulRequest)(response, "New QR Generated", "New QR Code Generated", newQR);
                    }
                    else {
                        (0, SharedFunctions_1.failedRequest)(response, "Failed To Get Response Back", "Unable To Update QR", "Unable To Update QR");
                    }
                }
                catch (error) {
                    (0, SharedFunctions_1.failedRequest)(response, "Failed To Find & Update QR by ._id", "Unable To Update QR", { error });
                }
            }
            else {
                (0, SharedFunctions_1.failedRequest)(response, "Failed To Verify Controlling Admin", "Failed To Verify Account. Delete And Generate New QR", "Failed To Verify Account");
            }
        }
        else {
            (0, SharedFunctions_1.failedRequest)(response, "Failed To Locate QR Object By ._id", "Failed TO Generate QR. Need To Setup New QR", "Unable to Locate QR");
        }
    }
    catch (error) {
        (0, SharedFunctions_1.failedRequest)(response, "Failed QR Generation", "Unable To Generate QR Code", { error });
    }
});
router.get("/verify", UserVerified_1.default, async (request, response) => {
    try {
        const qrToCompare = await qrCode_1.default.findOne({
            group: request.body.groupID,
            accessCode: request.body.codeToVerify
        });
        if (qrToCompare) {
            const timeDifference = Math.abs(new Date().getTime() - qrToCompare.expiryTime.getTime());
            const fiveMinutesInMilliseconds = 5 * 60 * 1000;
            const isMoreThanFiveMinutes = timeDifference > fiveMinutesInMilliseconds;
            if (!isMoreThanFiveMinutes) {
                (0, SharedFunctions_1.successfulRequest)(response, "Successful Request", "QR Verified: Proceed To Time Punch", qrToCompare);
            }
            else {
                (0, SharedFunctions_1.failedRequest)(response, "Expiry Token Past 5 Minutes", "Expired Token. Generate New QR And Try Again", "Expired Token");
            }
        }
        else {
            (0, SharedFunctions_1.failedRequest)(response, "Failed To Find By Group ID && Access Code", "Unable To Verify QR", "QR Find Failed");
        }
    }
    catch (error) {
        (0, SharedFunctions_1.failedRequest)(response, "Unable To Locate QR", "Unable To Verify: Try Again", { error });
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
        (0, SharedFunctions_1.failedRequest)(response, "Failed To Delete QR", "Unable To Delete QR", { error });
    }
});
exports.default = router;
//# sourceMappingURL=qrCode.js.map