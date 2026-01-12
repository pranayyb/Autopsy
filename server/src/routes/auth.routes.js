import express from "express";
import {
    registerUser,
    loginUser,
    verifyEmail,
    refreshAccessToken,
    forgotPasswordRequest,
    resetForgotPassword,
    getCurrentUser,
    resendEmailVerification,
    changeCurrentPassword,
    logoutUser,
} from "../controllers/auth.controller.js";
import {
    userRegisterValidator,
    userLoginValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator,
    userChangePasswordValidator,
} from "../validators/index.js";
import { validate } from "../middlewares/validate.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, loginUser);
router.route("/verify-email/:verificationToken").get(verifyEmail);
router.route("/refresh-token").get(refreshAccessToken);
router
    .route("/forgot-password")
    .post(userForgotPasswordValidator(), validate, forgotPasswordRequest);
router
    .route("/reset-forgot-password/:resetToken")
    .post(userResetForgotPasswordValidator(), validate, resetForgotPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router
    .route("/resend-verification-email")
    .post(verifyJWT, resendEmailVerification);
router
    .route("/change-password")
    .post(
        verifyJWT,
        userChangePasswordValidator(),
        validate,
        changeCurrentPassword,
    );
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
