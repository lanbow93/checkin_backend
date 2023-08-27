import mongoose from "../db/connection";
import { IUserAccount } from "../utils/InterfacesUsed";

const {Schema, model} = mongoose

const userAccountSchema = new Schema<IUserAccount>({
    name: String,
    badgeName: {type: String, unique: true},
    email: {type: String, unique: true},
    groupNames: [String],
    currentTask: [[String, String]],
    adminOf: [String],
    accountID: {type: String, unique: true},
    isSiteAdmin: Boolean,
    isGroupAdmin: Boolean,
    isScheduleAdmin: Boolean
}, {timestamps: true})

const UserAccount = model("UserAccount", userAccountSchema)

export default UserAccount