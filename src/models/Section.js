const { default: mongoose } = require("mongoose");

const Section = mongoose.model("Section", new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    price: [{
        key: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        }
    }],
    avgRate: {
        type: Number,
        default: 0
    },
    rateCount: {  
        type: Number,
        default: 0
    }
}, {
    timestamps: true
}))

module.exports = Section