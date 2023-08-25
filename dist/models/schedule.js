"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../db/connection");
const { Schema, model } = connection_1.default;
const scheduleSchema = new Schema({
    user: { type: String, unique: true },
    group: String,
    assignedClockIn: [Date],
    assignedClockOut: [Date],
    userPunchIn: [[Date, String]],
    userPunchOut: [[Date, String]]
});
const Schedule = model("Schedule", scheduleSchema);
exports.default = Schedule;
//# sourceMappingURL=schedule.js.map