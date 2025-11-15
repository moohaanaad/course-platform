import mongoose, { model, Schema } from "mongoose";
import { genderTypes, roleTypes } from "../../common/constant/index.js";
import { hashPassword } from "../../utils/bcrypt/index.js";

const userSchema = new Schema({
    firstname: {
        type: String,
        minlength: 3,
        trim: true,
        required: true
    },
    lastname: {
        type: String,
        minlength: 3,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: Object.values(genderTypes),
        required: true,
    },
    role: {
        type: String,
        enum: Object.values(roleTypes),
        default: roleTypes.STUDENT
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    university: {
        type: String,
        trim: true,
        required: true
    },
    faculty: {
        type: String,
        trim: true,
        required: true
    },
    Specializations: [{
        type: String,
        trim: true,
        required: true
    }],
    code: {
        type: String,
        trim: true,
        required: true
    },
    civilIdPic: {
        type: String,
        trim: true
    },
    profilePic: {
        type: String,
        trim: true
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

userSchema.pre("save", function (next) {
    //isModified => check if password was changed
    if (this.isModified("password")) this.password = hashPassword(this.password)

    return next()
})

export const User = model('User', userSchema)