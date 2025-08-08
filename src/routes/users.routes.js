const express = require("express");
const router = express.Router();

// middlewares
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const id = require("../middlewares/id.middleware");

// controller
const usersController = require("../controllers/users.controller");
const { signupValidate, loginValidate, updateProfileValidate, updateStateValidate } = require("../validation/users.validate");

// routes

// GET
router.get("/", [auth, role(["admin", "supervisor"])], usersController.getAll);

router.get("/supervisors", [auth, role(["admin"])], usersController.getSupervisors)

router.get("/coach/:id", [auth, role(["admin"]), id], usersController.getCoach);

router.get("/state/:state", [auth, role(["admin", "supervisor"])], usersController.getByState)

router.get("/name", [auth, role(["admin", "supervisor"])], usersController.getByName)

router.get("/me", [auth, role(["user", "coach", "admin", "supervisor"])], usersController.getMyDetails)

router.get("/:id", [auth, role(["admin", "supervisor"]), id], usersController.getOne);

// POST
router.post("/login", [...loginValidate], usersController.login);

router.post("/signup", [...signupValidate], usersController.signup);

router.post("/logout", [auth], usersController.logout)

router.post("/refresh-token", usersController.refreshToken)

router.post("/coach/add", [auth, role(["admin"]), ...signupValidate], usersController.addCoach)

router.post("/supervisor/add", [auth, role(["admin"]), ...signupValidate], usersController.addSupervisor)

// PUT
router.put("/profile/update", [auth, role(["user", "coach"]),...updateProfileValidate], usersController.updateProfile);

router.put("/state/update/:id", [auth, role(["admin", "supervisor"]), id, ...updateStateValidate], usersController.updateState);

// DELETE
router.delete("/coach/delete/:id", [auth, role(["admin"]), id], usersController.deleteCoach)

router.delete("/supervisor/delete/:id", [auth, role(["admin"]), id], usersController.deleteSupervisor)

module.exports = router