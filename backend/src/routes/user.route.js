import { Router } from "express";
import { login, signup, logout } from "../controllers/user.controller.js";

const router = Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);

export default router;