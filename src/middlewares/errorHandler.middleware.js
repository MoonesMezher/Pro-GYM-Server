const logger = require("../config/winston");

const errorHandler = (err, req, res, next) => {
    logger.error(err.message)
    return res.status(500).json({ message: "Server error", error: err.message });
}

module.exports = errorHandler