const jwt = require("jsonwebtoken");
const { hash, verify } = require("../helpers/argon2.helper");
const User = require("../models/User");
const Profile = require("../models/Profile");
const SectionUser = require("../models/SectionUser");
const Schedule = require("../models/Schedule");
const SectionCoach = require("../models/SectionCoach");
const find = require("../helpers/find.helper");
const createToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET_KEY, { 
        expiresIn: "1h", 
    });
}

const createRefreshToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET_KEY_REFRESH_TOKEN, { 
        expiresIn: "7d", 
    });
}

const allowedStates = ["active", "inactive"];
const allowedTypes = ["user", "coach"]

class UsersControllor {
    async getAll(req, res) {
        try {
            const users = await Profile.paginate({ filter: {}, populate: "_user" });

            return res.status(200).json({ message: "Got all users successfully", users })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getOne(req, res) {
        try {
            const id = req.id;

            const isExist = await find(User, { _id: id, role: "user" }, "one");

            if(!isExist) {
                return res.status(404).json({ message: "Not found" })
            }

            const [user, sections, track] = await Promise.all([
                Profile.findOne({ _user: id }).populate("_user", "-password -refreshToken"),
                SectionUser.find({ _user: id }).populate("_section"),
                Schedule.find({ _user: id })
            ])

            const data = { user, sections, track }

            return res.status(200).json({ message: "Got user details successfully", data })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getByName(req, res) {
        try {
            const name = req.query?.name || "";

            let users;

            if(name) {
                users = await Profile.aggregate([
                    {
                        $lookup: {
                            from: "users", // Collection name of the User model (default is 'users')
                            localField: "_user",
                            foreignField: "_id",
                            as: "user"
                        }
                    },
                    { $unwind: "$user" }, // Convert the joined array to an object
                    {
                        $match: {
                            "user.name":  { 
                                $regex: name, 
                                $options: "i"  // Case-insensitive
                            }
                        }
                    },
                    {
                        $addFields: {
                            _user: {
                                _id: "$user._id", // Include the user ID
                                name: "$user.name", // Include other fields you want
                                email: "$user.email",
                                role: "$user.role",
                                createdAt: "$user.createdAt",
                                updatedAt: "$user.updatedAt",
                            }
                        }
                    },
                    {
                        $project: {
                            user: 0,
                            "_user.password": 0
                        }
                    },
                ]);
            } else {
                users = await Profile.find().populate("_user", "-password -refreshToken -__v")
            }

            return res.status(200).json({ message: "Got users successfully", users })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getMyDetails(req, res) {
        try {
            const id = req.user?._user?.id || req.user._id;

            const isExist = await find(User, { _id: id }, "one");

            if(!isExist) {
                return res.status(404).json({ message: "Not found" })
            }

            let data;

            if(req.user.role === "admin" || req.user.role === "supervisor") {
                data = await User.findById(id).select("-password -refreshToken -__v");
            } else if(req.user.role === "user") {
                const [user, sections] = await Promise.all([
                    Profile.findOne({ _user: id }).populate("_user", "-password -refreshToken"),
                    SectionUser.find({ _user: id }).populate("_section"),
                ])

                data = { user, sections }
            } else if(req.user.role === "coach") {
                const [user, sections] = await Promise.all([
                    Profile.findOne({ _user: id }).populate("_user", "-password -refreshToken"),
                    SectionCoach.find({ _user: id }).populate("_section"),
                ])

                data = { user, sections }
            }

            const role = data.role || data?.user?.role || data?.user?._user?.role;

            return res.status(200).json({ message: "Got my details successfully", data, role })
        } catch (error) {
            throw new Error(error.message);            
        }
    }

    async getCoach(req, res) {
        try {
            const id = req.id;

            const isExist = await find(User, { _id: id, role: "coach" }, "one");

            if(!isExist) {
                return res.status(404).json({ message: "Not found" })
            }

            const [user, sections] = await Promise.all([
                Profile.findOne({ _user: id }).populate("_user", "-password -refreshToken -__v"),
                SectionCoach.find({ _user: id }).populate("_section")
            ])

            const data = { user, sections }

            return res.status(200).json({ message: "Got coach details successfully", data })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getByState(req, res) {
        try {
            const state = req.params.state;
            const type = req.query.type;
            
            if(!allowedStates.includes(state)) {
                return res.status(400).json({ message: "Invalid state" })
            }
            
            let users;

            if(type && allowedTypes.includes(type)) {
                users = await Profile.aggregate([
                    {
                        $lookup: {
                            from: "users", // Collection name of the User model (default is 'users')
                            localField: "_user",
                            foreignField: "_id",
                            as: "user"
                        }
                    },
                    { $unwind: "$user" }, // Convert the joined array to an object
                    {
                        $match: {
                            "user.role": type // Filter by role from the User schema
                        }
                    },
                    {
                        $addFields: {
                            _user: {
                                _id: "$user._id", // Include the user ID
                                name: "$user.name", // Include other fields you want
                                email: "$user.email",
                                role: "$user.role",
                                createdAt: "$user.createdAt",
                                updatedAt: "$user.updatedAt",
                            }
                        }
                    },
                    {
                        $project: {
                            user: 0,
                            "_user.password": 0
                        }
                    },
                ]);
            } else {
                users = await Profile.find({ state }).populate("_user", "-password -refreshToken");
            }

            return res.status(200).json({ message: "Got users successfully", users })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async signup(req, res) {
        try {
            const { name, email, password } = req.body; 

            const hashed = await hash(password);

            const user = await User.create({ name, email, password: hashed });
            await Profile.create({ _user: user._id });

            return res.status(201).json({ message: "Signed up successfully" })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body; 

            const user = await User.findOne({ email });

            if(!user) {
                return res.status(400).json({ message: "Invalid Credentials" }) 
            }

            const verified = await verify(password, user.password);

            if(!verified) {
                return res.status(400).json({ message: "Invalid Credentials" }) 
            }

            const token = createToken({ email, id: user._id, role: user.role })

            const refreshToken = createRefreshToken({ email, id: user._id, role: user.role });

            user.refreshToken = refreshToken;

            await user.save();

            let data = await Profile.findOne({ _user: user._id }).populate("_user", "-password -refreshToken")

            if(!data) {
                data = await User.findOne({ email }).select("-password -refreshToken");
            }

            const role = data?.role || data._user.role;

            return res.status(201).json({ message: "Logged in successfully", data, token, role, refreshToken })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async logout(req, res) {
        try {
            const id = req.user._id || req.user._user._id; 

            await User.findByIdAndUpdate(id, { refreshToken: null });

            return res.status(200).json({ message: "Logged out successfully" })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(401).json({ message: "Refresh token required" });
            }
            
            // Verify refresh token
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY_REFRESH_TOKEN);
            
            // Check if token exists in DB
            const user = await User.findById(decoded.id);

            if (!user || user.refreshToken !== refreshToken) {
                return res.status(403).json({ message: "Invalid refresh token" });
            }

            const accessToken = createToken({
                id: user._id,
                email: user.email,
                role: user.role
            });

            return res.status(200).json({ message: "Refreshed token successfully", token: accessToken });
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    code: "REFRESH_TOKEN_EXPIRED",
                    message: "Refresh token expired. Please log in again." 
                });
            }

            throw new Error(error.message);
        }
    }

    async addCoach(req, res) {
        try {
            const { name, email, password } = req.body; 

            const hashed = await hash(password);

            const user = await User.create({ name, email, password: hashed, role: "coach" });
            await Profile.create({ _user: user._id });

            return res.status(201).json({ message: "Added coach successfully" })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async addSupervisor(req, res) {
        try {
            const { name, email, password } = req.body; 

            const hashed = await hash(password);

            await User.create({ name, email, password: hashed, role: "supervisor" });

            return res.status(201).json({ message: "Added supervisor successfully" })
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async updateProfile(req, res) {
        try {
            const body = req.body;

            const id = req.user._user._id;

            const name = body?.name || req.user._user.name;
            const bio = body?.bio || req.user.bio;
            const picture = body?.picture || req.user.picture;

            await User.findByIdAndUpdate(id, { name }, { new: true });
            const data = await Profile.findOneAndUpdate({ _user: id }, { bio, picture }, { new: true }).populate("_user","-password -refreshToken")

            return res.status(200).json({ message: "Updated profile successfully", data })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateState(req, res) {
        try {
            const { state } = req.body;

            const id = req.id;

            if (!allowedStates.includes(state)) {
                return res.status(400).json({ message: "Invalid state" })
            }

            const isExist = await find(User, { _id: id, role: { $in: ["user", "coach"] } }, "one");

            if(!isExist) {
                return res.status(404).json({ message: "Not found" })
            }

            await Profile.updateOne({ _user: id }, { state });

            return res.status(200).json({ message: "Updated state successfully" })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteSupervisor(req, res) {
        try {
            const id = req.id;

            const isExist = await find(User, { _id: id, role: "supervisor" }, "one");

            if(!isExist) {
                return res.status(404).json({ message: "Not found" })
            }

            await User.findByIdAndDelete(id);

            return res.status(200).json({ message: "Deleted supervisor successfully" })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteCoach(req, res) {
        try {
            const id = req.id;
            
            const isExist = await find(User, { _id: id, role: "coach" }, "one");

            if(!isExist) {
                return res.status(404).json({ message: "Not found" })
            }

            await Promise.all([
                User.deleteOne({ _id: id }),
                Profile.deleteOne({ _user: id }),
                SectionCoach.deleteMany({ _user: id })
            ]);

            return res.status(200).json({ message: "Deleted coach successfully" })
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new UsersControllor();