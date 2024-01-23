// routes
const categoryRouter = require("express").Router();

const categoryController = require("../../controllers/category/index");

categoryRouter.get("/list", categoryController.categoryList);
categoryRouter.get("/:topic", categoryController.getCategoryByName);
categoryRouter.post("/add", categoryController.createCategory);

categoryRouter.get("/followers/:topic", categoryController.getFollowersCount);
categoryRouter.delete(
  "/:category/followers/:userId",
  categoryController.removeFollower
);

module.exports = categoryRouter;
