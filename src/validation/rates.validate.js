const { body } = require("express-validator");
const validate = require("../middlewares/validate.middleware");

const addRateValidate = [
    body("rate")
        .isInt().withMessage("Rate must be number")
        .custom(async (value) => {
            const allowedRates = [1,2,3,4,5];

            if(!allowedRates.includes(value)) {
                throw new Error("Invalid rate")
            }

            return true;
        })
    .bail(),

    body("message")
        .isString().withMessage("Message must be string")
    .bail(),

    validate
];

module.exports = {
    addRateValidate
}