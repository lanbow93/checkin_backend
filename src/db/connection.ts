import mongoose, { Error } from "mongoose";
import dotenv from "dotenv"
dotenv.config()

const DATABASE_URL: string = process.env.DATABASE_URL || ""

mongoose.connect(DATABASE_URL)

mongoose.connection
    .on("open", () => {console.log("Mongo connection established")})
    .on("close", () => {console.log("Mongo connection termination")})
    .on("error", (error: Error) => {console.log(error)})

export default mongoose 