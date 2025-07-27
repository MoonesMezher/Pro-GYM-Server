const handleAvgRate = require("../helpers/handleAvgRate.helper");
const Rate = require("../models/Rate");
const Section = require("../models/Section");

class RatesController {
    async add(req, res) {
        try {
            const id = req.id;

            const section = await Section.findById(id)

            if(!section) {
                return res.status(404).json({ message: "Not found" })
            }

            const userId = req.user._user._id;

            const { rate, message } = req.body;

            await Promise.all([
                Rate.create({ _section: id, _user: userId, rate, message }),
                handleAvgRate(id)
            ]);

            return res.status(200).json({ message: "Added rate successfully" })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteByAdmin(req, res) {
        try {
            const id = req.id;

            const rate = await Rate.findById(id)

            if(!rate) {
                return res.status(404).json({ message: "Not found" })
            }

            await Promise.all([
                Rate.deleteOne({ _id: id }),
                handleAvgRate(rate._section)
            ]);

            return res.status(200).json({ message: "Deleted rate successfully" })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteOne(req, res) {
        try {
            const id = req.id;

            const user = req.user._user._id;

            const rate = await Rate.findOne({ _id: id, _user: user })

            if(!rate) {
                return res.status(404).json({ message: "Not found" })
            }

            await Promise.all([
                Rate.deleteOne({ _id: id }),
                handleAvgRate(rate._section)
            ]);

            return res.status(200).json({ message: "Deleted rate successfully" })
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new RatesController();