import { Schema, Types } from "mongoose";

export const sectionSchema = new Schema({

    name: { type: String, trim: true, required: true },
    videos: [{
        name: { type: String, trim: true, required: true },
        video: { type: String, trim: true, required: true },
        materials: [{ type: String, trim: true, }]
    }],
    price: { type: Number, trim: true, required: true },
    students: [{ type: Types.ObjectId, ref: 'User' }],
    questions: [{
        user: { type: Types.ObjectId, ref: "User" },
        question: { type: String, trim: true }
    }],
})