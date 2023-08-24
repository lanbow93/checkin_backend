"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
dotenv.config();
const express = require("express");
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
app.get("/", (request, response) => {
    console.log(request);
    response.json({ "status": "server is functional" });
});
// App listener
const PORT = parseInt(process.env.PORT || "") || 7777;
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map