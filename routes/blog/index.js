// routes
const blogRouter = require("express").Router();

const blogController = require("../../controllers/blog/index");

blogRouter.get("/list", blogController.blogList);
blogRouter.post("/add", blogController.createBlog);
blogRouter.delete("/remove/:id", blogController.blogDelete);
blogRouter.get("/:id", blogController.singleBlog);

module.exports = blogRouter;
