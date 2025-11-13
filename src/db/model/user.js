import mongoose, { model, Schema } from "mongoose";
import { genderTypes } from "../../common/constant/index.js";

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
    gender: {
        type: String,
        enum: Object.values(genderTypes),
        required: true,
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
    }
})

export const User = model('User', userSchema)