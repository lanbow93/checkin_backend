"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.qrVerified = exports.userLoggedIn = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET = process.env.SECRET || "";
const VSECRET = process.env.VSECRET || "";
async function userLoggedIn(request, response, next) {
    try {
        const { token = false } = request.cookies;
        if (token) {
            const payload = await jsonwebtoken_1.default.verify(token, SECRET);
            request.payload = payload;
            next();
        }
        else {
            throw "Not logged In";
        }
    }
    catch (error) {
        response.status(400).json({
            message: "Failed User Verification",
            status: "User Cookie Not Verified"
        });
    }
}
exports.userLoggedIn = userLoggedIn;
async function qrVerified(request, response, next) {
    try {
        const { QRtoken = false } = request.cookies;
        if (QRtoken) {
            const payload = await jsonwebtoken_1.default.verify(QRtoken, VSECRET);
            request.payload = payload;
            next();
        }
        else {
            throw "QR Not Verified/Expired";
        }
    }
    catch (error) {
        response.status(400).json({
            message: "Failed QR Verification",
            status: "User QR Not Verified/Expired"
        });
    }
}
exports.qrVerified = qrVerified;
//# sourceMappingURL=UserVerified.js.map