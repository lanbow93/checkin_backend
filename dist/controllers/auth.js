"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
router.get("/", async (request, response) => {
    const allUsers = user_1.default.find({});
    console.log(allUsers);
    console.log(request.body);
    response.status(200).json({
        page: "AuthRouter",
        status: "Successfully Reached"
    });
});
router.post("/signup", async (request, response) => {
    try {
        request.body.resetToken = "";
        request.body.resetTokenExpiry = new Date();
        request.body.username = request.body.username.toLowerCase();
        request.body.password = await bcryptjs_1.default.hash(request.body.password, await bcryptjs_1.default.genSalt(10));
        const user = await user_1.default.create(request.body);
        response.status(200).json({
            message: "User Created",
            data: user
        });
    }
    catch (error) {
        response.status(400).json({
            message: "User Creation Failed",
            data: error
        });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map