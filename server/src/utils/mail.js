import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Task Manager",
            link: "https://taskmanager.com",
        },
    });
    const emailTextual = mailGenerator.generatePlaintext(
        options.mailgenContent,
    );
    const emailHTML = mailGenerator.generate(options.mailgenContent);

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS,
        },
    });

    const mail = {
        from: '"mail.taskmanager.com" <no-reply@mail.taskmanager.com>',
        to: options.email,
        subject: options.subject,
        text: emailTextual, // Plain-text version of the message
        html: emailHTML, // HTML version of the message
    };

    try {
        await transporter.sendMail(mail);
    } catch (err) {
        console.error("Error sending email:", err);
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
            intro: "We got a request to reset your password. Click the link below to set a new password.",
            action: {
                instructions:
                    "Click the button below to verify your email address.",
                button: {
                    color: "#c03207ff",
                    text: "Reset Password",
                    link: passwordResetURL,
                },
            },
            outro: "Need help? Just reply to this email. We'd love to assist you.",
        },
    };
};

export {
    sendEmail,
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
};
