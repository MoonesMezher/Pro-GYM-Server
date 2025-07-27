const { body } = require("express-validator");
const validate = require("../middlewares/validate.middleware");
const WorkHours = require("../models/WorkHours");

const addItemValidate = [
    body("days")
        .isString().withMessage("Days must be string")
        .custom(async (value) => {
            const item = await WorkHours.findOne({ days: value });

            if(item) {
                throw new Error("Invalid day value")
            }

            return true;
        })
    .bail(),

    body("hours")
        .isString().withMessage("Hours must be string")
    .bail(),

    validate
];

module.exports = {
    addItemValidate
}