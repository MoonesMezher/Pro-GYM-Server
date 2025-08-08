const find = require("../helpers/find.helper");
const Section = require("../models/Section");
const SectionCoach = require("../models/SectionCoach");
const SectionUser = require("../models/SectionUser");
const Rate = require("../models/Rate");
const User = require("../models/User");

class SectionsController {
    async getAll(req, res) {
        try {
            const sections = await Section.find();

            return res.status(200).json({ message: "Got all sections successfully", sections })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAllCoaches(req, res) {
        try {
            const id = req.params.id;

            const [coaches, addedCoaches] = await Promise.all([
                User.find({ role: "coach" }),
                SectionCoach.find({ _section: id })
            ]);

            const data = coaches.map(e => {
                if(addedCoaches.find(ee => ee._id === e?._id)) {
                    return { name: e?.name, _id: e._id, checked: true }
                } else {
                    return { name: e?.name, _id: e._id, checked: false }
                }
            })

            return res.status(200).json({ message: "Got all coaches successfully", data })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await User.find({});

            return res.status(200).json({ message: "Got all sections successfully", users })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getOne(req, res) {
        try {
            const id = req.id;

            const [section, coaches, users, rates] = await Promise.all([
                Section.findById(id),
                SectionCoach.find({ _section: id }).populate("_user", "-password -refreshToken"),
                SectionUser.find({ _section: id }).populate("_user", "-password -refreshToken"),
                Rate.find({ _section: id }).populate("_user", "-password -refreshToken")
            ]); 

            const data = { section, coaches, users, rates }

            return res.status(200).json({ message: "Got section details successfully", data })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async add(req, res) {
        try {
            const { title, description, images, price } = req.body;

            await Section.create({ title, description, images, price })

            return res.status(200).json({ message: "Added section successfully" })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async update(req, res) {
        try {
            let { title, description, images, price } = req.body;

            const id = req.id;

            const section = await find(Section, id, "id");

            if(!section) {
                return res.status(404).json({ message: "Not found" })
            }

            title = title || section.title;
            description = description || section.description;
            images = (images?.length === 0 || !images) ? section.images: images;
            price = (price?.length === 0 || !price) ? section.price: price;

            await Section.findByIdAndUpdate(id, { title, description, images, price })

            return res.status(200).json({ message: "Updated section successfully" })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteOne(req, res) {
        try {
            const id = req.id;

            const section = await find(Section, id, "id");

            if(!section) {
                return res.status(404).json({ message: "Not found" })
            }

            await Promise.all([
                Section.deleteOne({ _id: id }),
                SectionCoach.deleteMany({ _section: id }),
                SectionUser.deleteMany({ _section: id }),
                Rate.deleteMany({ _section: id })
            ]);

            return res.status(200).json({ message: "Deleted section successfully" })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async addCoches(req, res) {
        try {
            const { ids } = req.body;

            const id = req.id;

            const section = await Section.findById(id)

            if(!section) {
                return res.status(404).json({ message: "Not found" })
            }

            const assignments = ids.map(coachId => ({
                _section: id,
                _user: coachId
            }));

            await SectionCoach.insertMany(assignments);

            return res.status(200).json({ message: "Added coches to section successfully" })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async addUser(req, res) {
        try {
            const { user, price, expired } = req.body;

            const id = req.id;

            const section = await Section.findById(id)

            if(!section) {
                return res.status(404).json({ message: "Not found" })
            }

            const thePrice = section.price.find(e => e.key === price)

            await SectionUser.create({ _section: id, _user: user, price: thePrice.value, expired });

            return res.status(200).json({ message: "Added user to section successfully" })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteCoches(req, res) {
        try {
            const { ids } = req.body;

            const id = req.id;

            const section = await Section.findById(id)

            if(!section) {
                return res.status(404).json({ message: "Not found" })
            }

            await SectionCoach.deleteMany({
                _section: id,
                _user: { $in: ids }
            });

            return res.status(200).json({ message: "Deleted coches from section successfully" })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteUser(req, res) {
        try {
            const { user } = req.body;

            const id = req.id;

            const section = await Section.findById(id)

            if(!section) {
                return res.status(404).json({ message: "Not found" })
            }

            await SectionUser.deleteOne({ _user: user });

            return res.status(200).json({ message: "Deleted user from section successfully" })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteSubs(req, res) {
        try {
            const id = req.id;

            await SectionUser.deleteOne({ _id: id });

            return res.status(200).json({ message: "Deleted user sub successfully" })
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new SectionsController();