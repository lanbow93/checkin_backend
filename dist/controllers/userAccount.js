"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAccount_1 = __importDefault(require("../models/userAccount"));
const router = express_1.default.Router();
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