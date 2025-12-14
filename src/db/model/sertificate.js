import { model, Schema } from "mongoose"



const sertificateSceham = new Schema({
    sertificate: { type: String, required: true },
    
    instructorId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    courseName: { type: String, required: true },
    courseDescription: { type: String, required: true },

    students: [{ type: Schema.Types.ObjectId, ref: "User" }],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

export const Sertificate = model('Sertificate', sertificateSceham)