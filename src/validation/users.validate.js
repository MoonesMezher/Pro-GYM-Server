const { body } = require("express-validator");
const User = require("../models/User");
const validate = require("../middlewares/validate.middleware");
const ifExists = require("../global/exits");

const signupValidate = [
    body("name")
        .isString().withMessage("Name must be string")
    .bail(),

    body("email")
        .isString().withMessage("Email must be string")
        .isEmail().withMessage("Invalid Email")
        .custom(async (value) => {
            const isEmail = await User.findOne({ email: value });

            if(isEmail) {
                throw new Error("Your email is already exist")
            }

            return true;
        })
    .bail(),
    
    body("password")
        .isString().withMessage("Password must be string")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 charecter")
        .isStrongPassword().withMessage("Invalid Password")
    .bail(),

    validate
]

const loginValidate = [
    body("email")
        .isString().withMessage("Email must be string")
        .isEmail().withMessage("Invalid Email"),
    
    body("password")
        .isString().withMessage("Password must be string")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 charecter"),

    validate
]

const updateProfileValidate = [
    body("name")
        .optional()
        .if(ifExists)
        .isString().withMessage("Name must be string"),

    body("bio")
        .optional()    
        .if(ifExists)
        .isString().withMessage("Bio must be string"),

    body("picture")
        .optional()
        .if(ifExists)
        .isString().withMessage("Picture must be string"),

    validate
]

const updateStateValidate = [
    body("state")
        .isString().withMessage("State must be string"),

    validate
]

module.exports = {
    signupValidate,
    loginValidate,
    updateProfileValidate,
    updateStateValidate
}