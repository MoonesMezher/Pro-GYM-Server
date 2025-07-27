const { default: mongoose, Schema } = require("mongoose");

const sectionCoachSchema = new mongoose.Schema({
    _user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    _section: { type: Schema.Types.ObjectId, ref: 'Section', required: true }
}, {
    timestamps: true
});

sectionCoachSchema.index(
    { _section: 1, _user: 1 }, 
    { unique: true, name: "unique_section_coach" }
);

const SectionCoach = mongoose.model("SectionCoach", sectionCoachSchema)

module.exports = SectionCoach;