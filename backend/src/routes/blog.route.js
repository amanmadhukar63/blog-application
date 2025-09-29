import { Router } from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getMyBlogs,
  togglePublishStatus
} from "../controllers/blog.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").post(authenticateToken, createBlog);

router.route("/all").post(getAllBlogs);

router.route("/my-blogs").post(authenticateToken, getMyBlogs);

router.route("/:id")
  .get(getBlogById)
  .put(authenticateToken, updateBlog)
  .delete(authenticateToken, deleteBlog);

router.route("/toggle-publish/:id").patch(authenticateToken, togglePublishStatus);

export default router;