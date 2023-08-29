"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAccount_1 = __importDefault(require("../models/userAccount"));
const router = express_1.default.Router();
router.get("/", async (request, response) => {
    try {
        request.body.user_id = "64ee2f65860504f62c4242fe";
        const userAccounts = await userAccount_1.default.findOne({ accountID: request.body.user_id });
        response.status(200).json({ userAccounts });
    }
    catch (error) {
        response.status(400).json({
            status: "Unable To Locate Any UserAccounts",
            error: error
        });
    }
});
router.put("/changegroup/:id", async (request, response) => {
    try {
        const userID = request.params.id;
        const groupID = request.body.groupToEdit;
        const userAccount = await userAccount_1.default.findOne({ accountID: userID });
        if (userAccount) {
            if (userAccount.groupNames.includes(groupID)) {
                userAccount.groupNames.splice(userAccount.groupNames.indexOf(groupID), 1);
            }
            else {
                userAccount.groupNames.push(groupID);
            }
            const newUserAccount = await userAccount_1.default.findOneAndUpdate({ accountID: userID }, userAccount, { new: true });
            if (newUserAccount) {
                response.status(200).json({
                    status: "Successful Group Update",
                    data: newUserAccount
                });
            }
            else {
                response.status(400).json({
                    status: "Failed To Locate User For Update",
                    message: "Failed To Update User Groups"
                });
            }
        }
        else {
            response.status(400).json({
                status: "Failed To Locate User",
                message: "Unable To Change User",
                data: userAccount
            });
        }
    }
    catch (error) {
        response.status(400).json({
            status: "Failed To Update User Account",
            error: error
        });
    }
});
exports.default = router;
//# sourceMappingURL=userAccount.js.map