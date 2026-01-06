import rateLimit from "express-rate-limit";

export const insightLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: "Too many insight requests, slow down",
});
