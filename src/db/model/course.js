import { model, Schema, Types } from "mongoose"
import { sectionSchema } from "./course.section.js";


const courseSchema = new Schema({
    name: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: true },
    price: { type: Number, trim: true, required: true },
    freeVideo: { type: String, trim: true, required: true },
    instracter: { type: Types.ObjectId, ref: 'User', required: true },
    code: { type: String, trim: true, required: true },
    students: [{ type: Types.ObjectId, ref: 'Usaer' }],
    sections: [sectionSchema],
    ratings: [{
            user: { type: Types.ObjectId, ref: "User" },
            value: { type: Number, min: 1, max: 5 }
        }],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

//rating count
courseSchema.virtual("ratingCount").get(function () {
    return this.ratings?.length || 0;
});

//rating average
courseSchema.virtual("ratingAverage").get(function () {
    if (!this.ratings || this.ratings.length === 0) return 0;

    const sum = this.ratings.reduce((total, r) => total + r.value, 0);
    return sum / this.ratings.length;
});

export const Course = model("Course", courseSchema)