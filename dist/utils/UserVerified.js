"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET = process.env.SECRET || "";
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
exports.default = userLoggedIn;
//# sourceMappingURL=UserVerified.js.map