import { model, Schema, Types } from "mongoose";


const bannerSchema = new Schema({
    image: {
        type: String,
        trim: true,
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

export const Banner = model('Banner', bannerSchema)