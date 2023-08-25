import mongoose from "../db/connection";
import { IUser } from "../utils/InterfacesUsed";

const {Schema, model} = mongoose

const userSchema = new Schema<IUser>({
    username: String,
    password: String,
    email: String,
    resetToken: String,
    resetTokenExpiry: Date
}, {timestamps: true})

const User = model("User", userSchema)

export default User