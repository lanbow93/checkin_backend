"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const schedule_1 = __importDefault(require("../models/schedule"));
const UserVerified_1 = __importDefault(require("../utils/UserVerified"));
const SharedFunctions_1 = require("../utils/SharedFunctions");
const userAccount_1 = __importDefault(require("../models/userAccount"));
const router = express_1.default.Router();
router.get("/", async (request, response) => {
    const scheduleInfo = await schedule_1.default.find({});
    console.log(scheduleInfo);
    console.log(request.body);
    response.status(200).json({
        page: "Schedule Router",
        status: "Successfully Reached"
    });
});
router.post("/new", UserVerified_1.default, async (request, response) => {
    const userID = request.body.userID;
    const requestorID = request.body.requestorID;
    const groupID = request.body.groupID;
    try {
        const adminUserAccount = await userAccount_1.default.findOne({ accountID: requestorID });
        if (adminUserAccount) {
            const clockInTimes = request.body.clockInTimes.map((item) => [item, adminUserAccount.badgeName]);
            const clockOutTimes = request.body.clockOutTimes.map((item) => [item, adminUserAccount.badgeName]);
            if (adminUserAccount.adminOf.includes(groupID)) {
                const newSchedule = {
                    user: userID,
                    group: groupID,
                    assignedClockIn: clockInTimes,
                    assignedClockOut: clockOutTimes,
                    userPunchIn: [],
                    userPunchOut: []
                };
                const createdSchedule = await schedule_1.default.create(newSchedule);
                if (createdSchedule) {
                    (0, SharedFunctions_1.successfulRequest)(response, "Successful Schedule Creation", `New Schedule Was Created`, createdSchedule);
                }
                else {
                    (0, SharedFunctions_1.failedRequest)(response, "Failed To Make Schedule", "Unable To Create Schedule", "Unknown");
                }
            }
            else {
                (0, SharedFunctions_1.failedRequest)(response, "Unable To Locate Group In Admin List", "Unable To Update: Not Authorized", "Authorization: Admin");
            }
        }
        else {
            (0, SharedFunctions_1.failedRequest)(response, "Unable To Locate Requestor's Account", "Unable To Update Schedule", "Find Error: Requestor");
        }
    }
    catch (error) {
        (0, SharedFunctions_1.failedRequest)(response, "Failed Schedule Creation", "Unable To Create Schedule", { error });
    }
});
router.put("/addschedule", UserVerified_1.default, async (request, response) => {
    const userID = request.body.userID;
    const requestorID = request.body.requestorID;
    const groupID = request.body.groupID;
    try {
        const adminUserAccount = await userAccount_1.default.findOne({ accountID: requestorID });
        if (adminUserAccount) {
            const clockInTimes = request.body.clockInTimes.map((item) => [item, adminUserAccount.badgeName]);
            const clockOutTimes = request.body.clockOutTimes.map((item) => [item, adminUserAccount.badgeName]);
            if (adminUserAccount.adminOf.includes(groupID)) {
                const oldSchedule = await schedule_1.default.findOne({ user: userID, group: groupID });
                if (oldSchedule) {
                    oldSchedule.assignedClockIn = oldSchedule.assignedClockIn.concat(clockInTimes);
                    oldSchedule.assignedClockOut = oldSchedule.assignedClockOut.concat(clockOutTimes);
                    try {
                        const newSchedule = await schedule_1.default.findOneAndUpdate({ user: userID, group: groupID }, oldSchedule, { new: true });
                        if (newSchedule) {
                            (0, SharedFunctions_1.successfulRequest)(response, "Successful Update", "New Schedule Has Been Recorded", newSchedule);
                        }
                        else {
                            (0, SharedFunctions_1.failedRequest)(response, "Failed To Update Schedule", "Unable To Update User's Schedule", "Schedule Did Not Overrite");
                        }
                    }
                    catch (error) {
                        (0, SharedFunctions_1.failedRequest)(response, "Failed Put Request", "Unable To Update Schedule", { error });
                    }
                }
                else {
                    (0, SharedFunctions_1.failedRequest)(response, "Unable To Find Old Schedule", "Failed To Update Schedule", "Find: Old Schedule");
                }
            }
            else {
                (0, SharedFunctions_1.failedRequest)(response, "Unable To Locate Group In Admin List", "Unable To Update: Not Authorized", "Authorization: Admin");
            }
        }
        else {
            (0, SharedFunctions_1.failedRequest)(response, "Unable To Locate Requestor's Account", "Unable To Update Schedule", "Find Error: Requestor");
        }
    }
    catch (error) {
        (0, SharedFunctions_1.failedRequest)(response, "Failed Schedule Creation", "Unable To Create Schedule", { error });
    }
});
exports.default = router;
//# sourceMappingURL=schedule.js.map