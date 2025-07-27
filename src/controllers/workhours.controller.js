const WorkHours = require("../models/WorkHours");

class WorkHoursController {
    async getAll(req, res) {
        try {
            const data = await WorkHours.find({});

            return res.status(200).json({ message: "Got items succssefully", data })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async add(req, res) {
        try {
            const { days, hours } = req.body;

            await WorkHours.create({ days, hours });;

            return res.status(200).json({ message: "Added item succssefully" })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteOne(req, res) {
        try {
            const id = req.id;

            const item = await WorkHours.findById(id);

            if(!item) {
                return res.status(404).json({ message: "Not found" })
            }

            await item.deleteOne();

            return res.status(200).json({ message: "Delete item succssefully" })
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new WorkHoursController();