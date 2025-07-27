const { default: mongoose, Schema } = require("mongoose");

const rateSchema = new mongoose.Schema({
    _user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    _section: { type: Schema.Types.ObjectId, ref: 'Section', required: true },
    rate: {
        type: Number,
        enum: [1,2,3,4,5],
        default: 1
    },
    message: {
        type: String,
        required: true
    }
} ,{
    timestamps: true
});

const Rate = mongoose.model("Rate",rateSchema)

module.exports = Rate;

// section => id: 1
// 3, 4, 5
// => 3+4+5 / 3 => AVG = 4