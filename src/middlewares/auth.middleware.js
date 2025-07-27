const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");
const User = require("../models/User");

const auth = async (req, res, next) => {
    const { authorization } = req.headers;

    if(!authorization) {
        return res.status(401).json({ message: "Authorization must be required" })
    }

    try {
        const token = authorization.split(" ")[1]; // bearer token

        const { id, role } = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const isExist = await Profile.findOne({ _user: id }).populate("_user", "-password -refreshToken -role") || await User.findById(id)

        if(!isExist) {
            return res.status(401).json({ message: "Invalid Authorization" })
        }

        req.user = { token, role, ...isExist?._doc };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ code: "TOKEN_EXPIRED",message: "Session expired" });
        }

        throw new Error(error.message)
    }
}

module.exports = auth