"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAccount_1 = __importDefault(require("../models/userAccount"));
const UserVerified_1 = __importDefault(require("../utils/UserVerified"));
const SharedFunctions_1 = require("../utils/SharedFunctions");
const router = express_1.default.Router();
router.get("/", async (request, response) => {
    try {
        request.body.name = "Test";
        const userAccounts = await userAccount_1.default.find({});
        response.status(200).json({ userAccounts });
    }
    catch (error) {
        response.status(400).json({
            status: "Unable To Locate Any UserAccounts",
            error: error
        });
    }
});
router.get("/edit/:id", UserVerified_1.default, async (request, response) => {
    try {
        const userAccount = await userAccount_1.default.findOne({ accountID: request.params.id });
        if (userAccount) {
            if (userAccount.accountID === request.body.requestorID) {
                (0, SharedFunctions_1.successfulRequest)(response, "Successful Request", "Success", userAccount);
            }
            else {
                (0, SharedFunctions_1.failedRequest)(response, "User._id && Requestor._id Don't Match", "Unable To Access Records", "Authorization Failed");
            }
        }
        else {
            (0, SharedFunctions_1.failedRequest)(response, "Unable To Locate By accountID", "Account Doesn't Exist", "Unable To Locate");
        }
    }
    catch (error) {
        (0, SharedFunctions_1.failedRequest)(response, "Unable To Retrieve UserAccount", "Unable To Retrieve Account", { error });
    }
});
router.put("/updatedetails/:id");
exports.default = router;
//# sourceMappingURL=userAccount.js.map