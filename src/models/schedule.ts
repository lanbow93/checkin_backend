import mongoose from "../db/connection";
import { ISchedule } from "../utils/InterfacesUsed";

const {Schema, model} = mongoose

const scheduleSchema = new Schema<ISchedule>({
    user: String,
    group: String,
    assignedClockIn: [[String, String]],
    assignedClockOut: [[String, String]],
    userPunchIn: [[String, String]],
    userPunchOut: [[String, String]]
}, 
{timestamps: true})

scheduleSchema.index({user: 1, group: 1}, {unique: true})
const Schedule = model("Schedule", scheduleSchema)

export default Schedule