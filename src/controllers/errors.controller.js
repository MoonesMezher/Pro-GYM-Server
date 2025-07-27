const fs = require("fs")
const path = require("path")

class ErrorsController {
    async getAll(req, res) {
        try {
            const dir = path.join(__dirname, "../../logs/combined.log")

            const content = fs.readFileSync(dir, "utf8")

            const data = content.split("\r\n");

            return res.status(200).json({ message: "Got logs succssefully", data })
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new ErrorsController();