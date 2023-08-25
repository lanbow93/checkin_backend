import { Application, Request, Response } from "express";
import * as dotenv from "dotenv"
import * as cors from "cors"
import * as cookieParser from "cookie-parser";
import * as morgan from "morgan"
import * as express from "express"
dotenv.config()

// Router imports
import authRouter from "./controllers/auth"
import groupRouter from "./controllers/group"
import qrRouter from "./controllers/qrCode"

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
app.use("/auth", authRouter)
app.use("/group", groupRouter)
app.use("/qrcode", qrRouter)

app.get("/", (request: Request, response: Response) => {
    console.log(request.body)
    response.status(200).json({page: "Home",status: "server is functional"})
})

// App listener
const PORT: number = parseInt(process.env.PORT || "") || 7777

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
})


