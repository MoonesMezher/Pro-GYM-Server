const express = require("express");
const router = express.Router();

// middlewares
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const id = require("../middlewares/id.middleware");

// controller
const sectionsController = require("../controllers/sections.controller");

// validate
const { addSectionValidate, updateSectionValidate, addCochesValidate, deleteCochesValidate, addUserValidate, deleteUserValidate } = require("../validation/sections.validate");

// routes

// GET
router.get("/", sectionsController.getAll);

router.get("/:id", [id], sectionsController.getOne);

// POST
router.post("/add", [auth, role(["admin"]), ...addSectionValidate], sectionsController.add);

router.post("/add/coaches/section/:id", [auth, role(["admin"]), id, ...addCochesValidate], sectionsController.addCoches);

router.post("/add/user/section/:id", [auth, role(["admin", "supervisor"]), id, ...addUserValidate], sectionsController.addUser);

// PUT 
router.put("/update/:id", [auth, role(["admin"]), id, ...updateSectionValidate], sectionsController.update);

// DELETE
router.delete("/delete/coaches/section/:id", [auth, role(["admin"]), id, ...deleteCochesValidate], sectionsController.deleteCoches)

router.delete("/delete/user/section/:id", [auth, role(["admin", "supervisor"]), id, ...deleteUserValidate], sectionsController.deleteUser)

router.delete("/delete/user/:id", [auth, role(["admin", "supervisor"]), id], sectionsController.deleteSubs)

router.delete("/delete/:id", [auth, role(["admin"]), id], sectionsController.deleteOne);

module.exports = router