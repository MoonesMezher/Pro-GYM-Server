const express = require("express");
const app = express();

// import
const logger = require("morgan");
const cors = require("cors");
const path = require("path");
const errorHandler = require("./middlewares/errorhandler.middleware");
const notFound = require("./middlewares/notFound.middleware");

// pre middlewares
app.use(logger("dev"));
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(express.json())
app.use(express.static(path.join(__dirname, '../public/uploads')));

// routers
app.use("/api/uploads", require("./routes/uploads.routes"));
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/sections", require("./routes/section.routes"));
app.use("/api/rates", require("./routes/rates.routes"));
app.use("/api/schedules", require("./routes/schedules.routes"));
app.use("/api/logs", require("./routes/errors.routes"));
app.use("/api/hours", require("./routes/workhours.routes"));
app.use("/api/home", require("./routes/home.routes"));

// post middlewares
app.use(errorHandler);
app.use(notFound);

module.exports = app;