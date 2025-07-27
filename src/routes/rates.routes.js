const express = require("express");
const router = express.Router();

// middlewares
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const id = require("../middlewares/id.middleware");

// controller
const ratesController = require("../controllers/rates.controller");

// validate
const { addRateValidate } = require("../validation/rates.validate");

// routes

// POST
router.post("/section/:id", [auth, role(["user"]), id, ...addRateValidate], ratesController.add);

// DELETE
router.delete("/auth/:id", [auth, role(["admin", "supervisor"]), id], ratesController.deleteByAdmin);

router.delete("/:id", [auth, role(["user"]), id], ratesController.deleteOne);

module.exports = router