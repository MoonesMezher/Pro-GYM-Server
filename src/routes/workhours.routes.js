const express = require("express");
const router = express.Router();

// middlewares
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const id = require("../middlewares/id.middleware");

// controller
const workhoursController = require("../controllers/workhours.controller");

// validate
const { addItemValidate } = require("../validation/workhours.validate")

// routes

// GET
router.get("/", [auth, role(["admin"])], workhoursController.getAll);

// POST
router.post("/", [auth, role(["admin"]), ...addItemValidate], workhoursController.add);

// DELETE
router.delete("/:id", [auth, role(["admin"]), id], workhoursController.deleteOne);

module.exports = router