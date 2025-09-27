import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { uploadImage } from "../controllers/upload.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/image").post(authenticateToken, upload.fields([
  { name: 'coverImage', maxCount: 1 }
]), uploadImage);

export default router;