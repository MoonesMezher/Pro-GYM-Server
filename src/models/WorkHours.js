const { default: mongoose } = require("mongoose");

const WorkHours = mongoose.model("WorkHours", new mongoose.Schema({
    days: {
        type: String,
        required: true,
        unique: true
    },
    hours: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
}))

module.exports = WorkHours;