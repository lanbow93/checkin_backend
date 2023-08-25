import mongoose from "../db/connection";
import { IQRCode } from "../utils/InterfacesUsed";

const {Schema, model} = mongoose;

const qrCodeSchema = new Schema<IQRCode>({
    accessCode: String,
    expiryTime: Date,
    group: String,
    controllingAdmin: String
}, {timestamps: true})

const QRCode = model("QRCode", qrCodeSchema)

export default QRCode