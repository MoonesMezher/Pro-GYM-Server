const { body } = require("express-validator");
const validate = require("../middlewares/validate.middleware");
const Section = require("../models/Section");
const ifExists = require("../global/exits");
const { default: mongoose } = require("mongoose");
const SectionCoach = require("../models/SectionCoach");
const User = require("../models/User");
const SectionUser = require("../models/SectionUser");

const addSectionValidate = [
    body("title")
        .isString().withMessage("Title must be string")
        .custom(async (value) => {
            const isExist = await Section.findOne({ title: value });

            if(isExist) {
                throw new Error("Your title is already exist")
            }

            return true;
        })
    .bail(),

    body("description")
        .isString().withMessage("Description must be string")
    .bail(),

    body("images")
        .isArray().withMessage("Images must be an array")
        .custom(async (value) => {
            if(Array.isArray(value)) {
                value.forEach(element => {
                    if(typeof element !== "string") {
                        throw new Error("Invalid image")
                    }
                });
            }

            return true;
        })
    .bail(),

    body("price")
        .isArray().withMessage("Price must be an array")        
        .custom(async (value) => {
            if(Array.isArray(value)) {
                value.forEach(element => {
                    if(!element?.key || !element?.value) {
                        throw new Error("Invalid price")
                    }
    
                    if(typeof element.key !== "string" || typeof element.value !== "string") {
                        throw new Error("Invalid price")
                    }
                });
            }

            return true;
        })
    .bail(),

    validate
];

const updateSectionValidate = [
    body("title")
        .optional()
        .if(ifExists)
        .isString().withMessage("Title must be string")
        .custom(async (value) => {
            const isExist = await Section.findOne({ title: value });

            if(isExist) {
                throw new Error("Your title is already exist")
            }

            return true;
        })
    .bail(),

    body("description")
        .optional()
        .if(ifExists)
        .isString().withMessage("Description must be string")
    .bail(),

    body("images")
        .optional()
        .if(ifExists)
        .isArray().withMessage("Images must be an array")
        .custom(async (value) => {
            if(Array.isArray(value)) {
                value.forEach(element => {
                    if(typeof element !== "string") {
                        throw new Error("Invalid image")
                    }
                });
            }

            return true;
        })
    .bail(),

    body("price")
        .optional()
        .if(ifExists)
        .isArray().withMessage("Price must be an array")        
        .custom(async (value) => {
            if(Array.isArray(value)) {
                value.forEach(element => {
                    if(!element?.key || !element?.value) {
                        throw new Error("Invalid price")
                    }
    
                    if(typeof element.key !== "string" || typeof element.value !== "string") {
                        throw new Error("Invalid price")
                    }
                });
            }

            return true;
        })
    .bail(),

    validate
];

const addCochesValidate = [
    body("ids")
        .isArray().withMessage("Ids must be an array")
        .custom((value) => {
            if(Array.isArray(value)) {
                if (!value.every(id => mongoose.Types.ObjectId.isValid(id))) {
                    throw new Error("All IDs must be valid");
                }
            }

            return true;
        })
        .custom(async (value, { req }) => {
            if(Array.isArray(value)) {
                const sectionId = req.params.id;
                
                // Verify coaches exist and are actually coaches
                const coaches = await User.find({
                    _id: { $in: value },
                    role: "coach" // Ensure they have coach role
                });
                
                if (coaches.length !== value.length) {
                    throw new Error("One or more IDs are invalid or not coaches");
                }
                
                // Check for existing assignments
                const existingAssignments = await SectionCoach.countDocuments({
                    _section: sectionId,
                    _user: { $in: value }
                });
    
                if (existingAssignments > 0) {
                    throw new Error(`There are Coaches already assigned`);
                }
            }
            
            return true;
        })
        .bail(),

    validate
];

const deleteCochesValidate = [
    body("ids")
        .isArray().withMessage("Ids must be an array")
        .custom((value) => {                      
            if(Array.isArray(value)) {
                if (!value.every(id => mongoose.Types.ObjectId.isValid(id))) {
                    throw new Error("All IDs must be valid");
                }
            }
            return true;
        })
        .custom(async (value, { req }) => {            
            if(Array.isArray(value)) {
                const sectionId = req.params.id;
                
                // Verify coaches exist and are actually coaches
                const coaches = await User.find({
                    _id: { $in: value },
                    role: "coach" // Ensure they have coach role
                });
                
                if (coaches.length !== value.length) {
                    throw new Error("One or more IDs are invalid or not coaches");
                }
                
                // Check for existing assignments
                const existingAssignments = await SectionCoach.countDocuments({
                    _section: sectionId,
                    _user: { $in: value }
                });
    
                if (existingAssignments !== value.length) {
                    throw new Error(`Invalid Coaches assigned`);
                }
            }
            
            return true;
        })
        .bail(),

    validate
];

const addUserValidate = [
    body("user")
        .isString().withMessage("User must be string")
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("User must be valid");
            }

            return true;
        })
        .bail()
        .custom(async (value, { req }) => {
            const sectionId = req.params.id;
            
            const user = await User.findOne({
                _id: value,
                role: "user" 
            });
            
            if (!user) {
                throw new Error("Invalid user");
            }
            
            // Check for existing assignments
            const isExist = await SectionUser.findOne({
                _section: sectionId,
                _user: value
            });

            if (isExist && !isExist.isExpired) {
                throw new Error(`The user alredy exist`);
            }
            
            return true;
        })
        .bail(),
    
    body("price")
        .isString().withMessage("Price must be string")
        .custom(async (value, { req }) => {
            const sectionId = req.params.id;
            
            const validPrice = await Section.findOne({
                _id: sectionId,
                "price.key": value  
            });
            
            if (!validPrice) {
                throw new Error("Invalid Price");
            }
            
            return true;
        })
        .bail(),

    body("expired")
        .isInt().withMessage("Expired must be number")
        .custom(async (value) => {
            
            if (value <= 0 || value > 365) {
                throw new Error("Invalid Expired value");
            }
            
            return true;
        })
        .bail(),
    

    validate
];

const deleteUserValidate = [
    body("user")
        .isString().withMessage("User must be string")
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("User must be valid");
            }

            return true;
        })
        .bail()
        .custom(async (value, { req }) => {
            const sectionId = req.params.id;
            
            const user = await User.findOne({
                _id: value,
                role: "user" 
            });
            
            if (!user) {
                throw new Error("Invalid user");
            }
            
            // Check for existing assignments
            const isExist = await SectionUser.findOne({
                _section: sectionId,
                _user: value
            });

            if (!isExist) {
                throw new Error(`The user does not exist`);
            }
            
            return true;
        })
        .bail(),    

    validate
];

module.exports = {
    addSectionValidate,
    updateSectionValidate,
    addCochesValidate,
    deleteCochesValidate,
    addUserValidate,
    deleteUserValidate
}