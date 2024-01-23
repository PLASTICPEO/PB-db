// routes
const blogRouter = require("express").Router();

const blogController = require("../../controllers/blog/index");

blogRouter.get("/all", blogController.allBlogList);
blogRouter.get("/user/:id", blogController.userBlogList);
blogRouter.get("/category/:categoryName", blogController.getBlogsByCategory);
blogRouter.get("/interested", blogController.userInterestedBlogs);
blogRouter.get("/top", blogController.getTopBlogs);
blogRouter.get("/:id", blogController.singleBlog);
blogRouter.post("/add", blogController.createBlog);
blogRouter.put("/update/:id", blogController.updateBlog);
blogRouter.put("/like/:id", blogController.blogLike);
blogRouter.put("/unlike/:id", blogController.blogUnlike);
blogRouter.delete("/remove/:id", blogController.blogDelete);

module.exports = blogRouter;
