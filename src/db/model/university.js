
import { model, Schema } from "mongoose";



const universitySchema = new Schema({
    name: { 
        ar: { type: String, minlength: 3, trim: true, required: true },
        en: { type: String, minlength: 3, trim: true, required: true }
    },
    createdBy: { type: Schema.Types.ObjectId, ref:"User", required: true}
},{
    timestamps: true
})

export const University = model("University", universitySchema);