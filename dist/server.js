"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const express = require("express");
dotenv.config();
// Router imports
const auth_1 = require("./controllers/auth");
const group_1 = require("./controllers/group");
const qrCode_1 = require("./controllers/qrCode");
// Create application object
const app = express();
// Middleware
app.use(cors({
    origin: ["http://localhost:7777"]
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("tiny"));
// Routes
app.use("/auth", auth_1.default);
app.use("/group", group_1.default);
app.use("/qrcode", qrCode_1.default);
app.get("/", (request, response) => {
    console.log(request.body);
    response.status(200).json({ page: "Home", status: "server is functional" });
});
// App listener
const PORT = parseInt(process.env.PORT || "") || 7777;
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map