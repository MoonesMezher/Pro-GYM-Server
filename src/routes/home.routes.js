const express = require("express");
const router = express.Router();

// middlewares
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

// controller
const homeController = require("../controllers/home.controller");

// routes

// GET
router.get("/", homeController.getAll);

router.get("/admin", [auth, role(["admin", "supervisor"])], homeController.getAdmin);

module.exports = router