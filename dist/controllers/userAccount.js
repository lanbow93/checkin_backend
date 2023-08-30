"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAccount_1 = __importDefault(require("../models/userAccount"));
const router = express_1.default.Router();
router.get("/", async (request, response) => {
    try {
        request.body.name = "Test";
        const userAccounts = await userAccount_1.default.find({});
        response.status(200).json({ userAccounts });
    }
    catch (error) {
        response.status(400).json({
            status: "Unable To Locate Any UserAccounts",
            error: error
        });
    }
});
exports.default = router;
//# sourceMappingURL=userAccount.js.map