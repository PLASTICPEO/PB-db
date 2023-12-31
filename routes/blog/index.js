// routes
const blogRouter = require("express").Router();

const blogController = require("../../controllers/blog/index");

blogRouter.get("/all", blogController.allBlogList);
blogRouter.get("/user", blogController.userBlogList);
blogRouter.get("/category/:categoryName", blogController.getBlogsByCategory);
blogRouter.get("/interested", blogController.userInterestedBlogs);
blogRouter.get("/:id", blogController.singleBlog);
blogRouter.post("/add", blogController.createBlog);
blogRouter.delete("/remove/:id", blogController.blogDelete);
blogRouter.put("/update/:id", blogController.updateBlog);
blogRouter.put("/like/:id", blogController.blogLike);
blogRouter.put("/unlike/:id", blogController.blogUnlike);

module.exports = blogRouter;
