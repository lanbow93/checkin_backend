"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const group_1 = __importDefault(require("../models/group"));
const router = express_1.default.Router();
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