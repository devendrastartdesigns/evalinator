var express = require("express");
const AuthController = require("../controllers/AuthController");

var router = express.Router();

router.post("/register", AuthController.register);
router.post("/validate-email", AuthController.validateEmail);
router.post("/login", AuthController.login);
router.post("/get-user-profile", AuthController.userProfile);
router.get("/list", AuthController.userList);
router.post("/upload", AuthController.upload);
module.exports = router;