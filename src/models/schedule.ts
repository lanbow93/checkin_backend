import mongoose from "../db/connection";
import { ISchedule } from "../utils/InterfacesUsed";

const {Schema, model} = mongoose

const scheduleSchema = new Schema<ISchedule>({
    user: {type: String, unique: true},
    group: String,
    assignedClockIn: [Date],
    assignedClockOut: [Date],
    userPunchIn: [[Date, String]],
    userPunchOut: [[Date, String]]
}, {timestamps: true})

const Schedule = model("Schedule", scheduleSchema)

export default Schedule