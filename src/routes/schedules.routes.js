const express = require("express");
const router = express.Router();

// middlewares
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const id = require("../middlewares/id.middleware");

// controller
const schedulesController = require("../controllers/schedule.controller");

// validate

// routes

// GET
router.get("/", [auth, role(["admin", "supervisor"])], schedulesController.getAll);

// POST
router.post("/:id", [auth, role(["admin", "supervisor"]), id], schedulesController.add);

// PUT
router.put("/:id", [auth, role(["admin", "supervisor"]), id], schedulesController.update);

// DELETE
router.delete("/:id", [auth, role(["admin", "supervisor"]), id], schedulesController.deleteOne);

module.exports = router