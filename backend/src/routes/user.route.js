import { Router } from "express";
import { login, signup, logout, verifyToken } from "../controllers/user.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/verifyToken").get(authenticateToken, verifyToken);

export default router;