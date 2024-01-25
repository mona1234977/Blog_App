const express = require("express");
const userController = require("../controllers/userController");
const userValidation = require("../validations/userValidations");
const router = express.Router();

router.get("/getAllUsers", userController.getAllUsers);
router.post(
  "/userRegister",
  userValidation.registrationRules,
  userController.register
);
router.post("/userLogin", userValidation.loginRules, userController.UserLogin);

module.exports = router;
