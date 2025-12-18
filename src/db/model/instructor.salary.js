import { model, Schema } from "mongoose";


const instructorsalarySchema = new Schema({
    instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true }
}, { timestamps: true })

export const instructorSalary = model('InstructorSalary', instructorsalarySchema);