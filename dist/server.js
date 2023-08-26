"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
const auth_1 = __importDefault(require("./controllers/auth"));
const group_1 = __importDefault(require("./controllers/group"));
const qrCode_1 = __importDefault(require("./controllers/qrCode"));
const schedule_1 = __importDefault(require("./controllers/schedule"));
const userAccount_1 = __importDefault(require("./controllers/userAccount"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("tiny"));
app.use("/user", auth_1.default);
app.use("/group", group_1.default);
app.use("/qrcode", qrCode_1.default);
app.use("/schedule", schedule_1.default);
app.use("/useraccount", userAccount_1.default);
app.get("/", (request, response) => {
    console.log(request.body);
    response.status(200).json({ page: "Home", status: "server is functional" });
});
const PORT = parseInt(process.env.PORT || "") || 7777;
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map