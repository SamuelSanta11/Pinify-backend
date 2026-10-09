import { Router } from "express";
import { createPostController, getFeedController } from "../controllers/post.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getFeedController);
router.post("/", authMiddleware, createPostController);

export default router;