"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const qrCode_1 = __importDefault(require("../models/qrCode"));
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
router.post("/new", async (request, response) => {
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
exports.default = router;
//# sourceMappingURL=qrCode.js.map