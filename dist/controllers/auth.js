"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const user_1 = require("../models/user");
const bcryptjs_1 = require("bcryptjs");
const router = express.Router();
router.get("/", async (request, response) => {
    const allUsers = user_1.default.find({});
    console.log(allUsers);
    console.log(request.body);
    response.status(200).json({
        page: "AuthRouter",
        status: "Successfully Reached"
    });
});
router.post("/signup", async (request, response) => {
    try {
        request.body.password = await bcryptjs_1.default;
    }
    finally {
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map