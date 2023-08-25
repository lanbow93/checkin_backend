import mongoose from "../db/connection";
import { IGroup } from "../utils/InterfacesUsed";

const {Schema, model} = mongoose

const groupSchema = new Schema<IGroup>({
    groupName: {type: String, unique: true},
    admins: [String],
    members: [String]
}, {timestamps: true})

const Group = model("Group", groupSchema)

export default Group