import { model, Schema, Types } from "mongoose"
import { sectionSchema } from "./course.section.js";
import randomstring from 'randomstring'

const courseSchema = new Schema({
    name: {
        ar: { type: String, minlength: 3, trim: true, required: true },
        en: { type: String, minlength: 3, trim: true, required: true }
    },
    description: {
        ar: { type: String, minlength: 3, trim: true, required: true },
        en: { type: String, minlength: 3, trim: true, required: true }
    },
    price: { type: Number, trim: true, required: true },
    freeVideo: { type: String, trim: true, required: true },
    instracter: { type: Types.ObjectId, ref: 'User', required: true },
    code: { type: String, trim: true },
    students: [{ type: Types.ObjectId, ref: 'Usaer' }],
    sections: [sectionSchema],
    ratings: [{
        user: { type: Types.ObjectId, ref: 'User' },
        value: { type: Number, min: 1, max: 5 }
    }],

    discount: { type: Number, min: 0 },

    startAt: { type: Date },
    endAt: { type: Date },
    isActive: { type: Boolean, default: false },

    createdBy: { type: Types.ObjectId, ref: 'User' },
    updatedBy: { type: Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

// --- hocks ---
courseSchema.pre('save', function (next) {
    if (!this.code) this.code = randomstring.generate(4)

    return next()
})

// --- virtuals ---
//rating count
courseSchema.virtual('ratingCount').get(function () {
    return this.ratings?.length || 0;
});

//rating average
courseSchema.virtual('ratingAverage').get(function () {
    if (!this.ratings || this.ratings.length === 0) return 0;

    const sum = this.ratings.reduce((total, r) => total + r.value, 0);
    return sum / this.ratings.length;
});

//price after discount
courseSchema.virtual('finalPrice').get(function () {
    return this.price - (this.price * ((this.discount || 0) / 100))
})

export const Course = model('Course', courseSchema)