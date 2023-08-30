"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const group_1 = __importDefault(require("../models/group"));
const UserVerified_1 = __importDefault(require("../utils/UserVerified"));
const userAccount_1 = __importDefault(require("../models/userAccount"));
const router = express_1.default.Router();
router.get("/", async (request, response) => {
    const groupDate = group_1.default.find({});
    console.log({ groupDate });
    console.log(request.body);
    response.status(200).json({
        page: "GroupRouter",
        status: "Successfully Reached"
    });
});
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
            userAccount.adminOf.push(newGroup._id.toString());
            userAccount.groupNames.push(newGroup._id.toString());
            const newUserAccount = await userAccount_1.default.findOneAndUpdate({ accountID: request.body.userID }, userAccount);
            response.json({
                status: "Successful Group Creation",
                data: { newGroup, newUserAccount }
            });
        }
        else {
            response.status(400).json({
                message: "Failed Group Creation",
                status: "Unable To Locate userAccount"
            });
        }
    }
    catch (error) {
        response.status(400).json({
            status: "Failed To Create Group",
            message: "Group Creation Failed"
        });
    }
});
router.get("/:id", UserVerified_1.default, async (request, response) => {
    try {
        const group = await group_1.default.findById(request.params.id);
        if (group) {
            if (group.admins.includes(request.body.requestorID)) {
                response.status(200).json({
                    status: "Successful GET Request",
                    data: group
                });
            }
            else {
                response.status(400).json({
                    status: "Failed Admin Verification",
                    message: "Failed To Get Group Informaiton"
                });
            }
        }
    }
    catch (error) {
        response.status(400).json({
            status: "Failed To Locate Group._ID",
            error: error
        });
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
                response.status(200).json({
                    status: "Successful Group Update",
                    data: data
                });
            }
            else {
                response.status(400).json({
                    status: "Unable To Locate .id In Admins",
                    message: "Failed To Update Group"
                });
            }
        }
        else {
            response.status(400).json({
                status: "Unable To Locate group._id",
                message: "Failed To Update Group"
            });
        }
    }
    catch (error) {
        response.status(400).json({
            status: "Failed Group Update",
            error: error
        });
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
                        response.status(400).json({
                            status: "Failed To Update User Account",
                            error: error
                        });
                    }
                }
                const newGroup = await group_1.default.findByIdAndUpdate(request.params.id, group, { new: true });
                data.newGroup = newGroup;
                response.status(200).json({
                    status: "Successful Admin Update",
                    data: data
                });
            }
            else {
                response.status(400).json({
                    status: "Unable To Locate .id In Admins",
                    message: "Failed To Update Admin"
                });
            }
        }
        else {
            response.status(400).json({
                status: "Unable To Locate group._id",
                message: "Failed To Update Admin"
            });
        }
    }
    catch (error) {
        response.status(400).json({
            status: "Failed Admin Update",
            error: error
        });
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
                        response.status(200).json({
                            status: "Group Deletion Successful",
                            data: data
                        });
                    }
                }
            }
        }
        else {
            response.status(400).json({
                status: "Unable To Locate Group._ID",
                message: "Failed To Delete Group"
            });
        }
    }
    catch (error) {
        response.status(400).json({
            status: "Failed To Delete Group",
            error: error
        });
    }
});
exports.default = router;
//# sourceMappingURL=group.js.map