"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAccount_1 = __importDefault(require("../models/userAccount"));
const UserVerified_1 = require("../utils/UserVerified");
const SharedFunctions_1 = require("../utils/SharedFunctions");
const mongoose_1 = __importDefault(require("mongoose"));
const group_1 = __importDefault(require("../models/group"));
const router = express_1.default.Router();
router.get("/edit/:id", UserVerified_1.userLoggedIn, async (request, response) => {
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
router.put("/updatedetails/:id", UserVerified_1.userLoggedIn, async (request, response) => {
    try {
        const oldAccount = await userAccount_1.default.findById(request.params.id);
        if (oldAccount) {
            if (oldAccount.accountID === request.body.requestorID) {
                const newAccount = {
                    name: request.body.name || oldAccount.name,
                    createdAt: oldAccount.createdAt,
                    updatedAt: oldAccount.updatedAt,
                    _id: oldAccount._id,
                    badgeName: request.body.badgeName || oldAccount.badgeName,
                    email: request.body.email || oldAccount.email,
                    groupNames: oldAccount.groupNames,
                    currentTask: request.body.currentTask || oldAccount.currentTask,
                    adminOf: oldAccount.adminOf,
                    accountID: oldAccount.accountID,
                    isSiteAdmin: oldAccount.isSiteAdmin,
                    isGroupAdmin: oldAccount.isGroupAdmin,
                    isScheduleAdmin: oldAccount.isScheduleAdmin
                };
                try {
                    const updatedAccount = await userAccount_1.default.findByIdAndUpdate(request.params.id, newAccount, { new: true });
                    if (updatedAccount) {
                        (0, SharedFunctions_1.successfulRequest)(response, "Successful Update", "Account Update Successful", updatedAccount);
                    }
                    else {
                        (0, SharedFunctions_1.failedRequest)(response, "Failed Update Response", "Unable To Update Account", "Account Update Failed");
                    }
                }
                catch (error) {
                    (0, SharedFunctions_1.failedRequest)(response, "Failed Update Try Attempt", "Unable To Update Account", { error });
                }
            }
            else {
                (0, SharedFunctions_1.failedRequest)(response, "Unable To Verify Requestor Id", "Failed To Update", "Authorization Error");
            }
        }
        else {
            (0, SharedFunctions_1.failedRequest)(response, "Failed To Locate Group._id", "Unable To Update", "Group Doesn't Exist");
        }
    }
    catch (error) {
        (0, SharedFunctions_1.failedRequest)(response, "Unable To Retrieve Record", "Failed To Update Account", { error });
    }
});
router.put("/task/:id", UserVerified_1.userLoggedIn, async (request, response) => {
    try {
        const userAccountToCompare = await userAccount_1.default.findById(request.params.id);
        if (userAccountToCompare) {
            let isRequestorAdmin = false;
            const groupsToCheck = await group_1.default.find({
                '_id': { $in: userAccountToCompare.groupNames.map((group_id) => new mongoose_1.default.Types.ObjectId(group_id)) }
            });
            if (groupsToCheck && groupsToCheck.length > 0) {
                for (let i = 0; i < groupsToCheck.length; i++) {
                    if (groupsToCheck[i].admins.includes(request.body.requestorID)) {
                        isRequestorAdmin = true;
                        break;
                    }
                }
                if (isRequestorAdmin) {
                    userAccountToCompare.currentTask = [request.body.task || "Off Duty", request.body.requestorID];
                    try {
                        const newUserAccount = await userAccount_1.default.findByIdAndUpdate(request.params.id, userAccountToCompare, { new: true });
                        if (newUserAccount) {
                            (0, SharedFunctions_1.successfulRequest)(response, "Successful Update", "Task Has Been Successfully Assigned", newUserAccount);
                        }
                        else {
                            (0, SharedFunctions_1.failedRequest)(response, "Failed To Update Task", "Unable To Update", "Unknown Error");
                        }
                    }
                    catch (error) {
                        (0, SharedFunctions_1.failedRequest)(response, "Failed To Update", "Unable To Update User", { error });
                    }
                }
                else {
                    (0, SharedFunctions_1.failedRequest)(response, "User Not Admin", "Failed To Verify Admin", "Authorization: No Admin Listed");
                }
            }
            else {
                (0, SharedFunctions_1.failedRequest)(response, "Failed To Locate By Group._ID(s)", "Unable To Locate User's Groups", "Not Found: User Groups");
            }
        }
        else {
            (0, SharedFunctions_1.failedRequest)(response, "Failed To Locate UserAccount._id", "Failed To Update: Unable To Locate User", "Find Error");
        }
    }
    catch (error) {
        (0, SharedFunctions_1.failedRequest)(response, "Failed Task Update", "Unable To Update User's Task", { error });
    }
});
exports.default = router;
//# sourceMappingURL=userAccount.js.map