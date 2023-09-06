"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../db/connection"));
const { Schema, model } = connection_1.default;
const scheduleSchema = new Schema({
    user: String,
    group: String,
    assignedClockIn: [[String, String]],
    assignedClockOut: [[String, String]],
    userPunchIn: [[String, String]],
    userPunchOut: [[String, String]]
}, { timestamps: true });
scheduleSchema.index({ user: 1, group: 1 }, { unique: true });
const Schedule = model("Schedule", scheduleSchema);
exports.default = Schedule;
//# sourceMappingURL=schedule.js.map