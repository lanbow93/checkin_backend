import mongoose from "../db/connection";
import { IUserAccount } from "../utils/InterfacesUsed";

const {Schema, model} = mongoose

const userAccountSchema = new Schema<IUserAccount>({
    name: String,
    badgeName: String,
    email: Number,
    groupNames: [String],
    currentTask: [[String, String]],
    adminOf: [String],
    isGroupAdmin: Boolean
}, {timestamps: true})

const UserAccount = model("UserAccount", userAccountSchema)

export default UserAccount