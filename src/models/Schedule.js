const { default: mongoose, Schema } = require("mongoose");

const Schedule = mongoose.model("Schedule", new mongoose.Schema({
    _user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    leave: { type: Date },
    state: {
        type: String,
        enum: ["on", "off"],
        default: "on"
    }
}, {
    timestamps: true
}))

module.exports = Schedule;