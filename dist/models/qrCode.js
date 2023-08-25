"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../db/connection"));
const { Schema, model } = connection_1.default;
const qrCodeSchema = new Schema({
    accessCode: String,
    expiryTime: Date,
    group: String,
    controllingAdmin: String
}, { timestamps: true });
const QRCode = model("QRCode", qrCodeSchema);
exports.default = QRCode;
//# sourceMappingURL=qrCode.js.map