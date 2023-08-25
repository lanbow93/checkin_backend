"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const userAccount_1 = require("../models/userAccount");
const router = express.Router();
router.get("/", async (request, response) => {
    const userAccountData = await userAccount_1.default.find({});
    console.log(userAccountData);
    console.log(request.body);
    response.status(200).json({
        page: "UserAccount Router",
        status: "Successfully Connected"
    });
});
exports.default = router;
//# sourceMappingURL=userAccount.js.map