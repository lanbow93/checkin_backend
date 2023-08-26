"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const userAccount_1 = __importDefault(require("../models/userAccount"));
dotenv_1.default.config();
const router = express_1.default.Router();
const SECRET = process.env.SECRET || "";
router.get("/", async (request, response) => {
    console.log(request.body);
    response.status(200).json({
        page: "AuthRouter",
        status: "Successfully Reached"
    });
});
router.post("/signup", async (request, response) => {
    try {
        request.body.name = request.body.name.toLowerCase().replace(/(?:^|\s|')\w/g, (m) => m.toUpperCase());
        request.body.password = await bcryptjs_1.default.hash(request.body.password, await bcryptjs_1.default.genSalt(10));
        const userObject = {
            username: request.body.username.toLowerCase(),
            password: request.body.password,
            email: request.body.email.toLowerCase(),
            resetToken: "",
            resetTokenExpiry: new Date()
        };
        const user = await user_1.default.create(userObject);
        const userAccountDetails = {
            name: request.body.name,
            badgeName: request.body.badgeName,
            email: request.body.email.toLowerCase(),
            groupNames: [],
            currentTask: ["Contact Manager To Be Added To Group", "System"],
            adminOf: [],
            isSiteAdmin: false,
            isGroupAdmin: false,
            isScheduleAdmin: false
        };
        const newUserAccount = await userAccount_1.default.create(userAccountDetails);
        response.status(200).json({ message: "User Created", data: { user: user, accountData: newUserAccount } });
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
        request.body.username = request.body.username.toLowerCase();
        const { username, password } = request.body;
        const user = await user_1.default.findOne({ username });
        if (user) {
            const passwordCheck = await bcryptjs_1.default.compare(password, user.password);
            if (passwordCheck) {
                const payload = { username };
                const token = await jsonwebtoken_1.default.sign(payload, SECRET);
                response.cookie("token", token, {
                    httpOnly: true,
                    path: "/",
                    sameSite: "none",
                    secure: request.hostname === "localhost" ? false : true
                }).json({ payload, status: "logged in" });
            }
            else {
                response.status(400).json({
                    message: "Username/Password is incorrect",
                    status: "Failed Pass Check"
                });
            }
        }
        else {
            response.status(400).json({
                message: "Username/Password is incorrect",
                status: "Failed User Check"
            });
        }
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