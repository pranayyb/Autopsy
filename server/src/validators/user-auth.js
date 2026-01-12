import { body } from "express-validator";

const userRegisterValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Invalid email format"),
        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required")
            .isLowercase()
            .withMessage("Username must be in lowercase")
            .isLength({ min: 3 })
            .withMessage("Username must be at least 3 characters long"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long")
            .isStrongPassword()
            .withMessage(
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol",
            ),
        body("fullname").optional().trim(),
    ];
};

const userLoginValidator = () => {
    return [
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").notEmpty().withMessage("Password is required"),
    ];
};

const userChangePasswordValidator = () => {
    return [
        body("oldPassword").notEmpty().withMessage("Old password is required"),
        body("newPassword")
            .notEmpty()
            .withMessage("New password is required")
            .isLength({ min: 8 }),
    ];
};

const userForgotPasswordValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Invalid email format"),
    ];
};

const userResetForgotPasswordValidator = () => {
    return [
        body("token").notEmpty().withMessage("Reset token is required"),
        body("newPassword")
            .trim()
            .notEmpty()
            .withMessage("New password is required")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long")
            .isStrongPassword()
            .withMessage(
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol",
            ),
    ];
};

export {
    userRegisterValidator,
    userLoginValidator,
    userChangePasswordValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator,
};
