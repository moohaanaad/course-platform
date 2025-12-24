import mongoose, { model, Schema } from "mongoose";
import { genderTypes, roleTypes } from "../../common/constant/index.js";
import { hashPassword } from "../../utils/bcrypt/index.js";
import randomstring from 'randomstring'

const userSchema = new Schema({
    firstname: {
        ar: { type: String, minlength: 3, trim: true, required: true },
        en: { type: String, minlength: 3, trim: true, required: true }
    },
    lastname: {
        ar: { type: String, minlength: 3, trim: true, required: true },
        en: { type: String, minlength: 3, trim: true, required: true }
    },

    phone: { type: String, trim: true, unique: true, required: true },
    email: { type: String, trim: true, unique: true, required: true },
    password: { type: String, required: true },
    gender: { type: String, enum: Object.values(genderTypes), required: true },

    role: { type: String, enum: Object.values(roleTypes), default: roleTypes.STUDENT },

    university: {
        type: String, trim: true, required: function () {
            return this.role == roleTypes.STUDENT ? true : false
        }
    },
    faculty: {
        type: String, trim: true, required: function () {
            return this.role == roleTypes.STUDENT ? true : false
        }
    },
    Specializations: [{
        type: String, trim: true, required: function () {
            return this.role == roleTypes.STUDENT ? true : false
        }
    }],

    deviceId: { type: String, trim: true },

    code: { type: String, trim: true },

    civilIdPic: { type: String, trim: true },

    profilePic: {
        key: { type: String, trim: true },
        url: { type: String, trim: true }
    },

    isConfirmed: {
        type: Boolean, default: function () {
            return this.role == roleTypes.STUDENT ? false : true
        }
    },
    isActive: { type: Boolean, default: false },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

// --- hocks ---
userSchema.pre("save", function (next) {
    //isModified => check if password was changed
    if (this.isModified("password")) this.password = hashPassword(this.password)
    if (!this.code) this.code = randomstring.generate(7)

    return next()
})

// --- virtuals ---
//merge firstname and lastname
userSchema.virtual('username').get(function () {
    return {
        en: this.firstname.en + ' ' + this.lastname.en,
        ar: this.firstname.ar + ' ' + this.lastname.ar
    }
})

export const User = model('User', userSchema)