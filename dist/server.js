"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
// Create application object
const app = express();
// Middleware
// Routes
app.get("/", (request, response) => {
    console.log(request);
    response.send("Server is functional");
});
// App listener
app.listen(7777, () => {
    console.log("Running on port 7777");
});
//# sourceMappingURL=server.js.map