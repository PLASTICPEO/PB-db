// routes
const blogRouter = require("express").Router();

const blogController = require("../../controllers/blog/index");

blogRouter.get("/list", blogController.blogList);
blogRouter.get("/:id", blogController.singleBlog);
blogRouter.post("/add", blogController.createBlog);
blogRouter.delete("/remove/:id", blogController.blogDelete);

module.exports = blogRouter;
