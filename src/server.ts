import { Application, Request, Response } from "express";

const express = require("express")

// Create application object
const app: Application = express();


// Middleware

// Routes

app.get("/", (request: Request, response: Response) => {
    console.log(request)
    response.send("Server is functional")
})

// App listener

app.listen(7777, () => {
    console.log("Running on port 7777")
})


