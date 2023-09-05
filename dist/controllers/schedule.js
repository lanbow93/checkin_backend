"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const schedule_1 = __importDefault(require("../models/schedule"));
const router = express_1.default.Router();
router.get("/", async (request, response) => {
    const scheduleInfo = await schedule_1.default.find({});
    console.log(scheduleInfo);
    console.log(request.body);
    response.status(200).json({
        page: "Schedule Router",
        status: "Successfully Reached"
    });
});
router.post("/new");
exports.default = router;
//# sourceMappingURL=schedule.js.map