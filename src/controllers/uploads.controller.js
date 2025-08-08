class UploadsController {
    async upload(req, res) {
        try {
            const files = req.files;

            if(!files || !Array.isArray(files)) {
                return res.status(400).json({ message: "Invalid files" })
            }

            const images = files.map(e => e.filename);

            return res.status(201).json({ message: "Upload files successfully", images })
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new UploadsController();