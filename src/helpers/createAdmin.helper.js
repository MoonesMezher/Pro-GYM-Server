const { hash } = require("./argon2.helper");

const createAdmin = async (User, name, email, password) => {
    try {
        const isExist = await User.findOne({ role: "admin" });
    
        if(isExist) {
            throw new Error("Admin is Existed")
        }
    
        const hashed = await hash(password);
    
        await User.create({ name, email, password: hashed, role: "admin" });
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = createAdmin