require("dotenv").config();

const app = require("./app");

const mongoose = require("mongoose");
const logger = require("./config/winston");

const PORT = process.env.PORT;
const MONGOURL = process.env.MONGOURL;

mongoose.connect(MONGOURL)
    .then(() => {
        console.log("Connected to the database successfully")
        app.listen(PORT, () => {
            console.log(`Running successfully on the port ${PORT} =>`, `http://localhost:${PORT}`)
        })
    })
    .catch(error => {
        logger.error(error.messsage)
    })