"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../db/connection");
const { Schema, model } = connection_1.default;
const userSchema = new Schema({
    username: { type: String, unique: true },
    password: String,
    email: { type: String, unique: true },
    resetToken: String,
    resetTokenExpiry: Date
}, { timestamps: true });
const User = model("User", userSchema);
exports.default = User;
//# sourceMappingURL=user.js.map