const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
    try {
        const result = validationResult(req);

        if(!result.isEmpty()) {
            return res.status(400).json({ errors: result.array().map(e => e.msg) })
        }

        next()
    } catch(error) {
        throw new Error(error.message)
    }
}

module.exports = validate