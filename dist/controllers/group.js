"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const group_1 = require("../models/group");
const router = express.Router();
router.get("/", async (request, response) => {
    const groupDate = group_1.default.find({});
    console.log({ groupDate });
    console.log(request.body);
    response.status(200).json({
        page: "GroupRouter",
        status: "Successfully Reached"
    });
});
exports.default = router;
//# sourceMappingURL=group.js.map