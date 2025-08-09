const rateLimit = require("express-rate-limit")

const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5,
    message: {
        code: "RATE_LIMIT",
        message: "Too many login attempts, try later"
    }
});

module.exports = {
    authLimiter
}