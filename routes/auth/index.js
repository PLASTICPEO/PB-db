// Routes
const router = require("express").Router();

const authController = require("../../controllers/auth/index");

router.post("/login", authController.signIn);

module.exports = router;
