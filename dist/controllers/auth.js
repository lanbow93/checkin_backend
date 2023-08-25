"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("../models/user"));
dotenv_1.default.config();
const router = express_1.default.Router();
router.get("/", async (request, response) => {
    console.log(request.body);
    response.status(200).json({
        page: "AuthRouter",
        status: "Successfully Reached"
    });
});
router.post("/signup", async (request, response) => {
    try {
        request.body.password = await bcryptjs_1.default.hash(request.body.password, await bcryptjs_1.default.genSalt(10));
        const userObject = {
            username: request.body.username.toLowerCase(),
            password: request.body.password,
            email: request.body.email.toLowerCase(),
            resetToken: "",
            resetTokenExpiry: new Date()
        };
        const user = await user_1.default.create(userObject);
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
router.post("/login", async (request, response) => {
    try {
        console.log(request.body);
    }
    catch (error) {
        response.status(400).json({
            message: "Failed to Login",
            data: error
        });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map