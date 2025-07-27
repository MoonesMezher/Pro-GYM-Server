const express = require("express");
const router = express.Router();

// middlewares
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const upload = require("../config/multer");

// controller
const uploadsController = require("../controllers/uploads.controller");

// routes

// POST
router.post("/", [auth, role(["admin", "coach", "user"]), upload.array("images")], uploadsController.upload);

module.exports = router