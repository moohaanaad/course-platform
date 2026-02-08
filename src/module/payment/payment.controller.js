import axios from "axios";
import { getAuthHeader } from "./mpgs.helper.js";
import { Course } from "../../db/model/course.js";
import { User } from "../../db/model/user.js";
import { errorResponse, successResponse } from "../../utils/res/index.js";
import randomstring from "randomstring";
import { messages } from "../../common/messages/message.js";
import { Payment } from "../../db/model/payment.js";
import { payableTypes, paymentStatusTypes } from "../../common/constant/payment.js";


export const createSession = async (req, res) => {

    const { payableId } = req.params;
    const userId = req.user._id;
    let payable = {}
    let price = 0
    let name = ''
    let courseExist = null

    // Check if user already paid for this course
    let paymentExist = await Payment.findOne({ userId, payable: { id: payableId } });
    if (paymentExist && paymentExist.status === paymentStatusTypes.SUCCESS) {
        return errorResponse({
            res,
            message: messages.course.section.studentAlreadyJoined,
            statusCode: 400
        });
    }


    // Verify course exists
    courseExist = await Course.findById(payableId);
    if (!courseExist) {
        courseExist = await Course.findOne({ "sections._id": payableId }, { "sections.$": 1, students: 1 });
        if (!courseExist) return errorResponse({ res, message: 'course or section notfound', statusCode: 404 })

        payable = { id: payableId, type: payableTypes.SECTION }
        price = courseExist.sections[0].price;
        name = courseExist.sections[0].name.en;
    } else {
        payable = { id: payableId, type: payableTypes.COURSE }
        price = courseExist.price;
        name = courseExist.name.en;
    }

    // Create session with MPGS

    const orderId = randomstring.generate()
    const response = await axios.post(
        `${process.env.MPGS_BASE_URL}/api/rest/version/100/merchant/${process.env.MPGS_MERCHANT_ID}/session`,
        {
            apiOperation: "INITIATE_CHECKOUT",
            interaction: {
                operation: "AUTHORIZE",
                merchant: {
                    name: process.env.MPGS_USERNAME
                }
            },
            order: {
                currency: "EGP",
                amount: price,
                id: orderId,
                description: `Payment for ${payable.type} ${name}`
            }
        },
        { headers: getAuthHeader() }
    );

    // Check if session exists in response
    if (!response.data.session || !response.data.session.id) {
        return errorResponse({
            res,
            message: "Failed to create payment session",
            statusCode: 500
        });
    }

    // Save payment session details to database
    if (paymentExist && paymentExist?.status !== paymentStatusTypes.SUCCESS) {
        paymentExist.amount = price;
        paymentExist.orderId = orderId;
        paymentExist.status = paymentStatusTypes.PENDING;
    }
    else {
        paymentExist = await Payment.create({
            orderId,
            userId,
            payable,
            amount: price,
            status: paymentStatusTypes.PENDING
        });

    }
    await paymentExist.save();

    return successResponse({
        res,
        statusCode: 200,
        message: "Payment session created successfully",
        data: {
            sessionId: response.data.session.id,
            orderId: orderId
        }
    });

};

export const verifyPayment = async (req, res) => {

    const { order } = req.body;


    console.log(order);

    // Fetch payment record
    const paymentExist = await Payment.findOne({ orderId: order.id });
    if (!paymentExist) {
        return errorResponse({
            res,
            message: "Payment record not found",
            statusCode: 404
        });
    }

    const response = await axios.get(
        `${process.env.MPGS_BASE_URL}/api/rest/version/100/merchant/${process.env.MPGS_MERCHANT_ID}/order/${paymentExist.orderId}`,
        {
            auth: {
                username: process.env.MPGS_USERNAME,
                password: process.env.MPGS_PASSWORD
            }
        }
    );

    const paymentOrder = response.data
    console.log("paymentOrder:", paymentOrder);
    console.log("response:", response);

    if (!paymentOrder || paymentOrder.result !== paymentStatusTypes.SUCCESS) {
        return errorResponse({
            res,
            message: "Payment not successfull",
            statusCode: 400
        });
    }
    if (
        paymentOrder.amount !== paymentExist.amount || paymentOrder.currency !== "EGP") {
        return errorResponse({
            res,
            message: "Payment amount or currency missmatch",
            statusCode: 400
        });
    }

    // Update payment record
    paymentExist.status = paymentStatusTypes.SUCCESS;
    await paymentExist.save();

    //join course or section
    if (paymentExist.payable.type === payableTypes.COURSE) {
        await Course.findByIdAndUpdate(paymentExist.payable.id, { $push: { students: paymentExist.userId } });

    } else {
        await Course.findOneAndUpdate({ "sections._id": paymentExist.payable.id }, { $push: { students: paymentExist.userId } });
    }

    return successResponse({
        res,
        statusCode: 200,
        message: messages.course.section.joinSectionSuccessfully,
        data: {
            courseId: paymentExist.payable.id,
            status: 'success'
        }
    });
};
