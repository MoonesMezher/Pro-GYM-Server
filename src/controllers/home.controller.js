const Profile = require("../models/Profile");
const Rate = require("../models/Rate");
const Section = require("../models/Section");
const User = require("../models/User");
const SectionUser = require("../models/SectionUser");

class HomeController {
    async getAll(req, res) {
        try {
            const [sections, rates] = await Promise.all([
                Section.find(),
                Rate.find().populate("_user _section", "-password -refreshToken").sort("rate").limit(3)
            ]);

            const ratesWithImages = await Promise.all(rates.map(async e=> {
                const img = await Profile.findOne({ _user: e._user._id }).select("picture")

                return { ...e._doc, picture: img.picture }
            }))

            const data = { sections, rates: ratesWithImages };

            return res.status(200).json({ message: "Got all home data successfully", data })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAdmin(req, res) {
        try {
            const [users, prices, coaches] = await Promise.all([
                Profile.countDocuments(),
                SectionUser.find().select("price"),
                User.countDocuments({ role: "coach" })
            ]);

            const total = prices.map(e => +e.price).reduce((a, b) => a+b, 0);

            const data = { users, total, coaches };

            return res.status(200).json({ message: "Got all admin dashboard data successfully", data })
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new HomeController()