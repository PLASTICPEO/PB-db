// Routes
const userRouter = require("express").Router();

const userController = require("../../controllers/user/index");

userRouter.get("/", userController.getUsers);
userRouter.get("/me", userController.getSingleUser);
userRouter.post("/create", userController.userCreate);

module.exports = userRouter;
