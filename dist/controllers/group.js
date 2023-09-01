"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const group_1 = __importDefault(require("../models/group"));
const UserVerified_1 = __importDefault(require("../utils/UserVerified"));
const userAccount_1 = __importDefault(require("../models/userAccount"));
const SharedFunctions_1 = require("../utils/SharedFunctions");
const router = express_1.default.Router();
router.post("/new", UserVerified_1.default, async (request, response) => {
    try {
        const userAccount = await userAccount_1.default.findOne({ accountID: request.body.userID });
        if (userAccount) {
            const group = {
                groupName: request.body.groupName,
                admins: [request.body.userID],
                members: [request.body.userID]
            };
            const newGroup = await group_1.default.create(group);
            if (newGroup) {
                userAccount.adminOf.push(newGroup._id.toString());
                userAccount.groupNames.push(newGroup._id.toString());
                const newUserAccount = await userAccount_1.default.findOneAndUpdate({ accountID: request.body.userID }, userAccount);
                if (newUserAccount) {
                    (0, SharedFunctions_1.successfulRequest)(response, "Successful Group Creation", `New Group Created With ${userAccount.badgeName} As Admin`, { newGroup, newUserAccount });
                }
                else {
                    (0, SharedFunctions_1.failedRequest)(response, "Failed To Update User Account", "Failed Group Creation", "Error Unknown");
                }
            }
            else {
                (0, SharedFunctions_1.failedRequest)(response, "Failed To Create New Group", "Unable To Create New Group", "Error Unknown");
            }
        }
        else {
            (0, SharedFunctions_1.failedRequest)(response, "Failed Group Creation", "Unable To Locate Account", "Unable To Find UserAccount");
        }
    }
    catch (error) {
        (0, SharedFunctions_1.failedRequest)(response, "Failed To Create Group", "Group Creation Failed", "Unable To Create Group: Unknown");
    }
});
router.get("/:id", UserVerified_1.default, async (request, response) => {
    try {
        const group = await group_1.default.findById(request.params.id);
        if (group) {
            if (group.admins.includes(request.body.requestorID)) {
                (0, SharedFunctions_1.successfulRequest)(response, "Successful Get Request", "Request Successful", group);
            }
            else {
                (0, SharedFunctions_1.failedRequest)(response, "Failed Admin Verification", "Failed To Get Group Information", "Not An Admin");
            }
        }
    }
    catch (error) {
        (0, SharedFunctions_1.failedRequest)(response, "Failed To Locate Group._ID", "Unable To View Group", { error });
    }
});
router.put("/editmembers/:id", UserVerified_1.default, async (request, response) => {
    const submittedGroup = request.body.groupUserArray;
    try {
        const group = await group_1.default.findById(request.params.id);
        if (group) {
            if (group.admins.includes(request.body.requestorID)) {
                const differences = submittedGroup.filter((userID) => !group.members.includes(userID));
                group.members = submittedGroup;
                try {
                    const newGroup = await group_1.default.findByIdAndUpdate(request.params.id, group, { new: true });
                    let data = { newGroup };
                    for (let i = 0; i < differences.length; i++) {
                        try {
                            const userID = differences[i];
                            const groupID = request.params.id;
                            const userAccount = await userAccount_1.default.findOne({ accountID: userID });
                            if (userAccount) {
                                if (userAccount.groupNames.includes(groupID)) {
                                    userAccount.groupNames.splice(userAccount.groupNames.indexOf(groupID), 1);
                                }
                                else {
                                    userAccount.groupNames.push(groupID);
                                }
                                const updatedAccount = await userAccount_1.default.findOneAndUpdate({ accountID: userID }, userAccount, { new: true });
                                data[`variable[${i}]`] = updatedAccount;
                            }
                        }
                        catch (error) {
                            response.status(400).json({
                                status: "Failed To Update User Account",
                                error: error
                            });
                        }
                    }
                    (0, SharedFunctions_1.successfulRequest)(response, "Successful Group Update", "Successfully Updated Members", data);
                }
                catch (error) {
                    (0, SharedFunctions_1.failedRequest)(response, "Failed Before Loop", "Failed Group Update: Unknown", "Failed To Update Group");
                }
            }
            else {
                (0, SharedFunctions_1.failedRequest)(response, "Unable To Locate _ID In Admins", "Failed To Update Group: Admin Permission Issue", "Not An Admin Of Group");
            }
        }
        else {
            (0, SharedFunctions_1.failedRequest)(response, "Unable To Locate Group._ID", "Failed To Update Group", "Group._ID Not Located");
        }
    }
    catch (error) {
        (0, SharedFunctions_1.failedRequest)(response, "Failed Group Update", "Failed To Update Members", { error });
    }
});
router.put("/editadmins/:id", UserVerified_1.default, async (request, response) => {
    const submittedGroup = request.body.adminUserArray;
    try {
        const group = await group_1.default.findById(request.params.id);
        if (group) {
            if (group.admins.includes(request.body.requestorID)) {
                const differences = submittedGroup.filter((userID) => !group.admins.includes(userID));
                group.admins = submittedGroup;
                let data = {};
                for (let i = 0; i < differences.length; i++) {
                    try {
                        const userID = differences[i];
                        const groupID = request.params.id;
                        const userAccount = await userAccount_1.default.findOne({ accountID: userID });
                        if (userAccount) {
                            if (userAccount.adminOf.includes(groupID)) {
                                userAccount.adminOf.splice(userAccount.adminOf.indexOf(groupID), 1);
                            }
                            else {
                                userAccount.adminOf.push(groupID);
                                if (!userAccount.groupNames.includes(groupID)) {
                                    userAccount.groupNames.push(groupID);
                                    group.members.push(groupID);
                                }
                            }
                            const updatedAccount = await userAccount_1.default.findOneAndUpdate({ accountID: userID }, userAccount, { new: true });
                            data[`variable[${i}]`] = updatedAccount;
                        }
                    }
                    catch (error) {
                        (0, SharedFunctions_1.failedRequest)(response, "Failed To Update User Account", "Failed User Group Update", { error });
                        break;
                    }
                }
                const newGroup = await group_1.default.findByIdAndUpdate(request.params.id, group, { new: true });
                if (newGroup) {
                    data.newGroup = newGroup;
                    (0, SharedFunctions_1.successfulRequest)(response, "Successful Admin Update", "Admin Record Changed Successfully", data);
                }
                else {
                    (0, SharedFunctions_1.failedRequest)(response, "Failed On Group Update Attempt", "Unable To Update Admin List", "Failed During Grop Update");
                }
            }
            else {
                (0, SharedFunctions_1.failedRequest)(response, "Unable To Locate .id In Admins", "Failed To Update Admin", "No Admin Permissions");
            }
        }
        else {
            (0, SharedFunctions_1.failedRequest)(response, "Unable To Locate Group._ID", "Failed To Update Admin", "Unable To Locate Group");
        }
    }
    catch (error) {
        (0, SharedFunctions_1.failedRequest)(response, "Failed Admin Update", "Unable To Update Admin List", { error });
    }
});
router.delete("/:id", UserVerified_1.default, async (request, response) => {
    const requestorID = request.query.requestorID?.toString() || "";
    try {
        const groupToDelete = await group_1.default.findById(request.params.id);
        if (groupToDelete) {
            if (groupToDelete.admins.includes(requestorID)) {
                const deletedGroup = await group_1.default.findByIdAndDelete(request.params.id);
                let data = { deletedGroup: deletedGroup };
                for (let i = 0; i < groupToDelete.members.length; i++) {
                    const accountToModify = await userAccount_1.default.findOne({ accountID: groupToDelete.members[i] });
                    if (accountToModify) {
                        if (accountToModify.adminOf.includes(request.params.id)) {
                            accountToModify.adminOf.splice(accountToModify.adminOf.indexOf(request.params.id), 1);
                        }
                        accountToModify.groupNames.splice(accountToModify.groupNames.indexOf(request.params.id), 1);
                        const newAccount = await userAccount_1.default.findOneAndUpdate({ accountID: groupToDelete.members[i] }, accountToModify, { new: true });
                        data[`user${i}`] = newAccount;
                    }
                    if (i === groupToDelete.members.length - 1) {
                        (0, SharedFunctions_1.successfulRequest)(response, "Group Deletion Successful", `Successfully Deleted Group ${groupToDelete.groupName}`, data);
                    }
                }
            }
        }
        else {
            (0, SharedFunctions_1.failedRequest)(response, "Unable To Locate Group._ID", "Failed To Delete Group", "Group.ID Issue");
        }
    }
    catch (error) {
        (0, SharedFunctions_1.failedRequest)(response, "Failed To Delete Group", "Failed To Delete Group", { error });
    }
});
exports.default = router;
//# sourceMappingURL=group.js.map