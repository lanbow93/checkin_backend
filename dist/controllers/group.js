"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const group_1 = __importDefault(require("../models/group"));
const UserVerified_1 = __importDefault(require("../utils/UserVerified"));
const user_1 = __importDefault(require("../models/user"));
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
        const userAccount = await user_1.default.findOne({ accountID: request.body.userID });
        if (userAccount) {
            const group = {
                groupName: request.body.groupName,
                admins: [userAccount._id],
                members: [userAccount._id]
            };
            const newGroup = await group_1.default.create(group);
            response.json({
                status: "Successful Group Creation",
                data: newGroup
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
            if (group.admins.indexOf(request.body.requestorID) !== -1) {
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
            data: error
        });
    }
});
exports.default = router;
//# sourceMappingURL=group.js.map