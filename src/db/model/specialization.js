import { model, Schema } from "mongoose";



const specializationSchema = new Schema({
    name: { 
        ar: { type: String, minlength: 3, trim: true, required: true },
        en: { type: String, minlength: 3, trim: true, required: true }
    },
    universityId: { type: Schema.Types.ObjectId, ref: "University", required: true },
    facultyId: { type: Schema.Types.ObjectId, ref: "Faculty", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, {
    timestamps: true
})

export const Specialization = model("Specialization", specializationSchema);

