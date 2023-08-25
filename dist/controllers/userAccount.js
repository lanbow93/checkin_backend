"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAccount_1 = __importDefault(require("../models/userAccount"));
const router = express_1.default.Router();
router.get("/", async (request, response) => {
    console.log(request.body);
    response.status(200).json({
        page: "UserAccount Router",
        status: "Successfully Connected"
    });
});
router.post("/new", async (request, response) => {
    try {
        const userAccountDetails = {
            name: request.body.name,
            badgeName: request.body.badgeName,
            email: request.body.email,
            groupNames: [],
            currentTask: ["Contact Manager To Be Added To Group", "System"],
            adminOf: [],
            isSiteAdmin: false,
            isGroupAdmin: false
        };
        const newUserAccount = await userAccount_1.default.create(userAccountDetails);
        response.status(200).json({
            message: "User Account Creation Successful",
            data: newUserAccount
        });
    }
    catch (error) {
        response.status(400).json({
            message: "Failed To Create User Account",
            data: error
        });
    }
});
exports.default = router;
//# sourceMappingURL=userAccount.js.map