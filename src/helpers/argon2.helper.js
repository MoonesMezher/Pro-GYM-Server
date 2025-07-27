const argon2 = require("argon2");

const hash = async (password) => {
    try {
        const hash = await argon2.hash(password, { saltLength: 16 });

        return hash;
    } catch (err) {
        throw new Error(err.message)
    }
}

const verify = async (password1, password2) => {
    try {
        const hash = await argon2.verify(password2, password1);

        return hash;
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    hash,
    verify
}