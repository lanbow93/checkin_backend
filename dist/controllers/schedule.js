"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const schedule_1 = __importDefault(require("../models/schedule"));
const UserVerified_1 = require("../utils/UserVerified");
const SharedFunctions_1 = require("../utils/SharedFunctions");
const userAccount_1 = __importDefault(require("../models/userAccount"));
const router = express_1.default.Router();
router.get("/", UserVerified_1.userLoggedIn, async (request, response) => {
    try {
        const schedule = await schedule_1.default.findOne({ user: request.query.targetUserID, group: request.query.targetGroupID });
        if (schedule) {
            (0, SharedFunctions_1.successfulRequest)(response, "Successful Schedule Request", "Successful Retrieval", schedule);
        }
        else {
            (0, SharedFunctions_1.failedRequest)(response, "Schedule Not Found By Parameters", "Unable To Get Schedule", "Find: Schedule Not Found");
        }
    }
    catch (error) {
        (0, SharedFunctions_1.failedRequest)(response, "Failed To Retrieve Schedule", "Unable To Get Schedule", { error });
    }
});
router.get("/admin", UserVerified_1.userLoggedIn, async (request, response) => {
    const userID = request.query.targetUserID || "";
    const groupID = request.query.targetGroupID || "";
    const requestorID = request.query.requestorID;
    try {
        const adminUserAccount = await userAccount_1.default.findOne({ accountID: requestorID });
        if (adminUserAccount) {
            if (adminUserAccount.adminOf.includes(groupID) || adminUserAccount.isSiteAdmin || adminUserAccount.isScheduleAdmin) {
                let scheduleQuery = {};
                if (groupID) {
                    scheduleQuery.group = groupID;
                }
                if (userID && groupID || userID && (adminUserAccount.isSiteAdmin || adminUserAccount.isScheduleAdmin)) {
                    scheduleQuery.user = userID;
                }
                console.log(scheduleQuery);
                const schedule = await schedule_1.default.find(scheduleQuery);
                if (schedule.length > 0) {
                    (0, SharedFunctions_1.successfulRequest)(response, "Successful Schedule Fetch", "Success", schedule);
                }
                else {
                    (0, SharedFunctions_1.failedRequest)(response, "Failed To Locate By Find", "No Schedules Exist With Those Parameters", "Find Error: Not Found");
                }
            }
            else {
                (0, SharedFunctions_1.failedRequest)(response, "Unable To Locate Group In Admin List", "Unable To Find: Not Authorized", "Authorization: Admin");
            }
        }
        else {
            (0, SharedFunctions_1.failedRequest)(response, "Unable To Locate Requestor's Account", "Unable To View Schedule", "Find Error: Requestor");
        }
    }
    catch (error) {
        (0, SharedFunctions_1.failedRequest)(response, "Failed Schedule Search", "Unable To View Schedule", { error });
    }
});
router.post("/new", UserVerified_1.userLoggedIn, async (request, response) => {
    const userID = request.body.userID;
    const requestorID = request.body.requestorID;
    const groupID = request.body.groupID;
    try {
        const adminUserAccount = await userAccount_1.default.findOne({ accountID: requestorID });
        if (adminUserAccount) {
            const clockInTimes = request.body.clockInTimes.map((item) => [item, adminUserAccount.badgeName]);
            const clockOutTimes = request.body.clockOutTimes.map((item) => [item, adminUserAccount.badgeName]);
            if (adminUserAccount.adminOf.includes(groupID) || adminUserAccount.isSiteAdmin || adminUserAccount.isScheduleAdmin) {
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
router.put("/addschedule", UserVerified_1.userLoggedIn, async (request, response) => {
    const userID = request.body.userID;
    const requestorID = request.body.requestorID;
    const groupID = request.body.groupID;
    try {
        const adminUserAccount = await userAccount_1.default.findOne({ accountID: requestorID });
        if (adminUserAccount) {
            const clockInTimes = request.body.clockInTimes.map((item) => [item, adminUserAccount.badgeName]);
            const clockOutTimes = request.body.clockOutTimes.map((item) => [item, adminUserAccount.badgeName]);
            if (adminUserAccount.adminOf.includes(groupID) || adminUserAccount.isSiteAdmin || adminUserAccount.isScheduleAdmin) {
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
router.put("/update/:id", UserVerified_1.userLoggedIn, async (request, response) => {
    try {
        const oldSchedule = await schedule_1.default.findById(request.params.id);
        if (oldSchedule) {
            oldSchedule.assignedClockIn = request.body.clockInTimes || oldSchedule.assignedClockIn;
            oldSchedule.assignedClockIn = request.body.clockOutTimes || oldSchedule.assignedClockIn;
            oldSchedule.userPunchIn = request.body.punchInTimes || oldSchedule.userPunchIn;
            oldSchedule.userPunchOut = request.body.punchOutTimes || oldSchedule.userPunchOut;
            const newSchedule = await schedule_1.default.findByIdAndUpdate(request.params.id, oldSchedule, { new: true });
            if (newSchedule) {
                (0, SharedFunctions_1.successfulRequest)(response, "Successful Request", "Success", newSchedule);
            }
            else {
                (0, SharedFunctions_1.failedRequest)(response, "Schedule Update Returned Nothing", "Schedule Not Updated", "Find And Update Step Failed");
            }
        }
        else {
            (0, SharedFunctions_1.failedRequest)(response, "Failed To Locate Previous Schedule", "Unable To Update Schedule", "Find: Schedule._id");
        }
    }
    catch (error) {
        (0, SharedFunctions_1.failedRequest)(response, "Unable To Update Schedule", "Failed To Update", { error });
    }
});
exports.default = router;
//# sourceMappingURL=schedule.js.map