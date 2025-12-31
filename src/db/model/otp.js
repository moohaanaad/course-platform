import { model, Schema, Types } from "mongoose";

const otpSchema = new Schema({

    email: { type: String, required: true },
    otp: { type: String, required: true },
    distroyedAt: { type: Date, default: Date.now }

}, { timestamps: true })

//ttl => timne to leave
otpSchema.index({ distroyedAt: 1 }, { expireAfterSeconds: 15*60 })

//model
export const Otp = model('otp', otpSchema)