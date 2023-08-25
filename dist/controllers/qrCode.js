"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const qrCode_1 = require("../models/qrCode");
const router = express.Router();
router.get("/", async (request, response) => {
    const qrData = await qrCode_1.default.find({});
    console.log(qrData);
    console.log(request.body);
    response.status(200).json({
        page: "QRRouter",
        status: "Reached Successfully"
    });
});
exports.default = router;
//# sourceMappingURL=qrCode.js.map