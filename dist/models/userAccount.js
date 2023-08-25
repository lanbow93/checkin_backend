"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../db/connection"));
const { Schema, model } = connection_1.default;
const userAccountSchema = new Schema({
    name: String,
    badgeName: { type: String, unique: true },
    email: { type: String, unique: true },
    groupNames: [String],
    currentTask: [[String, String]],
    adminOf: [String],
    isGroupAdmin: Boolean
}, { timestamps: true });
const UserAccount = model("UserAccount", userAccountSchema);
exports.default = UserAccount;
//# sourceMappingURL=userAccount.js.map