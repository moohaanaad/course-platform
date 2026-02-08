// payment.routes.js
import express from "express";
import { asyncHandler } from "../../middleware/async-handler.js";
import { createSession, verifyPayment } from "./payment.controller.js";
import { isAuthenticate } from "../../middleware/authentication.js";

const paymentRouter = express.Router();

paymentRouter.use(isAuthenticate());

/**
 * STEP 1: Create Payment Session
 * POST /:courseId/create-session
 * Creates a payment session for a specific course
 */
paymentRouter.post(
    "/:payableId/create-session", 
    asyncHandler(createSession)
);



/**
 * STEP 3: Verify Payment
 * POST /verify
 * Records successful payment in user's history
 * Body: { courseId, transactionId, amount }
 */
paymentRouter.post(
    "/verify",
    asyncHandler(verifyPayment)
);

/**
 * Check Payment Status
 * GET /:courseId/status
 * Checks if user has paid for a specific course
 */
// paymentRouter.get(
//     "/:courseId/status",
//     asyncHandler(checkPaymentStatus)
// );

export default paymentRouter;