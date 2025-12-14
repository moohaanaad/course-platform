import { Schema, Types } from "mongoose";

export const sectionSchema = new Schema({

    name: {
        ar: { type: String, minlength: 3, trim: true, required: true },
        en: { type: String, minlength: 3, trim: true, required: true }
    },
    videos: [{
        name: {
            ar: { type: String, minlength: 3, trim: true, required: true },
            en: { type: String, minlength: 3, trim: true, required: true }
        },
        video: { type: String, trim: true, required: true },
        materials: [{ type: String, trim: true, }],
        isWatched: { type: Boolean, default: false }
    }],
    price: { type: Number, trim: true, required: true },
    students: [{ type: Types.ObjectId, ref: 'User' }],
    questions: [{
        userId: { type: Types.ObjectId, ref: "User" },
        userEmail: { type: String, trim: true },
        question: { type: String, trim: true }
    }],
})