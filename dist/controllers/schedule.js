"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const schedule_1 = require("../models/schedule");
const router = express.Router();
router.get("/", async (request, response) => {
    const scheduleInfo = await schedule_1.default.find({});
    console.log(scheduleInfo);
    console.log(request.body);
    response.status(200).json({
        page: "Schedule Router",
        status: "Successfully Reached"
    });
});
exports.default = router;
//# sourceMappingURL=schedule.js.map