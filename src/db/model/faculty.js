import { model, Schema } from "mongoose";



const facultySchema = new Schema({
    name: { 
        ar: { type: String, minlength: 3, trim: true, required: true },
        en: { type: String, minlength: 3, trim: true, required: true }
    },
    universityId: { type: Schema.Types.ObjectId, ref: "University", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, {
    timestamps: true
})

export const Faculty = model("Faculty", facultySchema);