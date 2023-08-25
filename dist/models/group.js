"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../db/connection");
const { Schema, model } = connection_1.default;
const groupSchema = new Schema({
    groupName: { type: String, unique: true },
    admins: [String],
    members: [String]
}, { timestamps: true });
const Group = model("Group", groupSchema);
exports.default = Group;
//# sourceMappingURL=group.js.map