import { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import express from "express";
dotenv.config();

// Router imports
import authRouter from "./controllers/auth";
import groupRouter from "./controllers/group";
import qrRouter from "./controllers/qrCode";
import scheduleRouter from "./controllers/schedule";
import userAccountRouter from "./controllers/userAccount"

// Create application object
const app: Application = express();


// Middleware

app.use(cors({
    origin: ["http://localhost:5173", "https://speedycheckin.netlify.app"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("tiny"));

// Routes
app.use("/user", authRouter);
app.use("/group", groupRouter);
app.use("/qrcode", qrRouter);
app.use("/schedule", scheduleRouter);
app.use("/useraccount", userAccountRouter)

app.get("/", (request: Request, response: Response) => {
    console.log(request.body);
    response.status(200).json({page: "Home",status: "server is functional"});
});

// App listener
const PORT: number = parseInt(process.env.PORT || "") || 7777;

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});


