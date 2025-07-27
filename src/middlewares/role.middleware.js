const role = (roles) => {
    return async (req, res, next) => {
        try {
            for (const role of roles) {
                if(req.user.role === role) {
                    next();
                    return;
                }
            }
            
            return res.status(401).json({ message: "You cannot access to this action" })
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = role