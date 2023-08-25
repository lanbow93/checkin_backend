"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../db/connection"));
const { Schema, model } = connection_1.default;
const scheduleSchema = new Schema({
    user: { type: String, unique: true },
    group: String,
    assignedClockIn: [Date],
    assignedClockOut: [Date],
    userPunchIn: [[Date, String]],
    userPunchOut: [[Date, String]]
}, { timestamps: true });
const Schedule = model("Schedule", scheduleSchema);
exports.default = Schedule;
//# sourceMappingURL=schedule.js.map