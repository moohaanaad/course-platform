import { model, Schema } from "mongoose";
import { payableTypes, paymentStatusTypes } from "../../common/constant/index.js";


const paymentSchema = new Schema({

    orderId: String,

    userId: { type: Schema.Types.ObjectId, ref: "User" },
    payable: { 
        id: { type: Schema.Types.ObjectId, ref: "Course" },
        type: { type: String, enum: Object.values(payableTypes), required: true }
    },
    
    amount: { type: Number, required: true },
    status: { type: String, enum: Object.values(paymentStatusTypes), default: paymentStatusTypes.PENDING }
});

export const Payment = model("Payment", paymentSchema);