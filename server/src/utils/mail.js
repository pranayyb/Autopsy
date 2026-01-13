import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const createTransporter = () => {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

const sendEmail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: process.env.APP_NAME || "Task Manager",
            link: process.env.APP_URL || "https://taskmanager.com",
        },
    });
    const emailTextual = mailGenerator.generatePlaintext(
        options.mailgenContent,
    );
    const emailHTML = mailGenerator.generate(options.mailgenContent);

    const transporter = createTransporter();

    const mail = {
        from: `"${process.env.EMAIL_FROM_NAME || "Task Manager"}" <${
            process.env.EMAIL_USER
        }>`,
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHTML,
    };

    try {
        await transporter.sendMail(mail);
        console.log(`Email sent successfully to ${options.email}`);
    } catch (err) {
        console.error("Error sending email:", err);
        throw err; 
    }
};

const emailVerificationMailgenContent = (username, verificationURL) => {
    return {
        body: {
            name: username,
            intro: "Welcome to our service! Please verify your email by clicking the link below.",
            action: {
                instructions:
                    "Click the button below to verify your email address.",
                button: {
                    color: "#22BC66",
                    text: "Verify Email",
                    link: verificationURL,
                },
            },
            outro: "Need help? Just reply to this email. We'd love to assist you.",
        },
    };
};

const forgotPasswordMailgenContent = (username, passwordResetURL) => {
    return {
        body: {
            name: username,
            intro: "We received a request to reset your password. Click the link below to set a new password.",
            action: {
                instructions: "Click the button below to reset your password.",
                button: {
                    color: "#c03207ff",
                    text: "Reset Password",
                    link: passwordResetURL,
                },
            },
            outro: "If you didn't request a password reset, you can safely ignore this email. Need help? Just reply to this email.",
        },
    };
};

export {
    sendEmail,
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
};
