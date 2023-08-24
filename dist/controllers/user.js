"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../db/connection");
const { Schema, model } = connection_1.default;
const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    resetToken: String,
    resetTokenExpiry: Date
});
const User = model("User", userSchema);
exports.default = User;
//# sourceMappingURL=user.js.map