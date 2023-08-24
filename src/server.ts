import { Application, Request, Response } from "express";
import * as dotenv from "dotenv"
import * as cors from "cors"
import * as cookieParser from "cookie-parser";
import * as morgan from "morgan"


dotenv.config()

const express = require("express")

// Create application object
const app: Application = express();


// Middleware

app.use(cors({
    origin: ["http://localhost:7777"]
}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan("tiny"))

// Routes

app.get("/", (request: Request, response: Response) => {
    console.log(request)
    response.json({"status": "server is functional"})
})

// App listener
const PORT: number = parseInt(process.env.PORT || "") || 7777

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
})


