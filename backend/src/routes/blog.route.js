import { Router } from "express";

const router = Router();

router.route("/").get();
router.route("/:id").get();
router.route("/create").post();
router.route("/:id").put();
router.route("/:id").delete();

export default router;