// Routes
const userRouter = require("express").Router();

const userController = require("../../controllers/user/index");

userRouter.get("/", userController.getUsers);
userRouter.get("/:id", userController.getSingleUser);
userRouter.post("/create", userController.userCreate);

module.exports = userRouter;
