const { default: mongoose, Schema } = require("mongoose");
const paginate = require("../plugins/paginate");

const profileSchema = new mongoose.Schema({
    _user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    bio: { 
        type: String, 
        default: "None"
    },
    picture: {
        type: String,
        default: "default.webp"
    },
    state: {
        type: String, 
        enum: ["active", "inactive"], 
        default: "active" 
    }
}, {
    timestamps: true
});

profileSchema.plugin(paginate);

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;