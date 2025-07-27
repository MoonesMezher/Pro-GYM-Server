const { default: mongoose } = require("mongoose");
const paginate = require("../plugins/paginate");
const createAdmin = require("../helpers/createAdmin.helper");
const logger = require("../config/winston");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: { 
        type: String, 
        unique: true, 
        required: true 
    },
    password: {
        type: String,
        required: true
    },
    role: { 
        type: String, 
        enum: ['user', 'admin', 'supervisor', 'coach'], 
        default: 'user' 
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
});

userSchema.plugin(paginate);

const User = mongoose.model("User", userSchema);

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME;

createAdmin(User, name, email, password)
    .then(e => {
        logger.info("Admin is created")
    })
    .catch(err => {        
        logger.error(err)
    })

module.exports = User;