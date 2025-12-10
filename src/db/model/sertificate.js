import { model, Schema } from "mongoose"



const sertificateSceham = new Schema({
    courseId: { type: Schema.Types.ObjectId, ref: "course", required: true },
    instractorId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    courseName: { type: String, required: true },
    courseDescription: { type: String, required: true },
    students: [{ type: Schema.Types.ObjectId, ref: "user" }],
    sertificate: { type: String, required: true },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

export const Sertificate = model('Sertificate', sertificateSceham)