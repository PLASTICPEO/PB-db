// Routes
const router = require("express").Router();

const authController = require("../../controllers/auth/index");

router.post("/", authController.signIn);

module.exports = router;
