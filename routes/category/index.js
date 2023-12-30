// routes
const categoryRouter = require("express").Router();

const categoryController = require("../../controllers/category/index");

categoryRouter.get("/list", categoryController.categoryList);
categoryRouter.get("/:topic", categoryController.getCategoryByName);
categoryRouter.post("/add", categoryController.createCategory);

module.exports = categoryRouter;
