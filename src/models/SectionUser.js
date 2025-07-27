const { default: mongoose, Schema } = require("mongoose");

const sectionUserSchema = new mongoose.Schema({
    _user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    _section: { type: Schema.Types.ObjectId, ref: "Section", required: true },
    price: {
        type: String,
        required: true
    },
    expired: {
        type: Number,
        default: 30
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

sectionUserSchema.virtual('isExpired').get(function() {
    const expirationDate = new Date(this.createdAt);
    expirationDate.setDate(expirationDate.getDate() + this.expired);
    return expirationDate < new Date();
});

// Virtual property: Get exact expiration date
sectionUserSchema.virtual('expirationDate').get(function() {
    const date = new Date(this.createdAt);
    date.setDate(date.getDate() + this.expired);
    return date;
});

sectionUserSchema.index({ createdAt: 1 });

const SectionUser = mongoose.model("SectionUser", sectionUserSchema)

module.exports = SectionUser;