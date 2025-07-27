const express = require("express");
const router = express.Router();

// middlewares
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

// controller
const errorsController = require("../controllers/errors.controller");

// routes

// GET
router.get("/", [auth, role(["admin"])], errorsController.getAll);

module.exports = router