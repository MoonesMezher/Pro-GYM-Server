const Profile = require("../models/Profile");
const Schedule = require("../models/Schedule");

const allowedStates = ["on", "off"]

class SchedulesController {
    async getAll(req, res) {
        try {
            const { state } = req.query;

            const live = await Schedule.countDocuments({ state: "on" });

            let schedules;

            if(!state || !allowedStates.includes(state)) {
                schedules = await Schedule.find().populate("_user", "-password -refreshToken");
            } else {
                schedules = await Schedule.find({ state }).populate("_user", "-password -refreshToken");
            }

            return res.status(200).json({ message: "Got schedules successfully", data: schedules, live })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async add(req, res) {
        try {
            const id = req.id;

            const user = await Profile.findOne({ _user: id });

            if(!user) {
                return res.status(404).json({ message: "Not found" })
            }

            if(user.state !== "active") {
                return res.status(400).json({ message: "This user not active" })
            }

            const live = await Schedule.findOne({ _user: id, state: "on" });

            if(live) {
                return res.status(400).json({ message: "This user is active" })
            }

            await Schedule.create({ _user: id });

            return res.status(200).json({ message: "Added new schedule successfully" })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async update(req, res) {
        try {
            const id = req.id;

            const schedule = await Schedule.findById(id);

            if(!schedule) {
                return res.status(404).json({ message: "Not found" })
            }

            if(schedule.state === "off") {
                return res.status(400).json({ message: "Invalid update" })
            }

            schedule.state = "off";
            schedule.leave = new Date(Date.now())

            await schedule.save();

            return res.status(200).json({ message: "Updated schedule successfully" })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteOne(req, res) {
        try {
            const id = req.id;

            const schedule = await Schedule.findById(id);

            if(!schedule) {
                return res.status(404).json({ message: "Not found" })
            }

            await schedule.deleteOne();

            return res.status(200).json({ message: "Deleted schedule successfully" })
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new SchedulesController();