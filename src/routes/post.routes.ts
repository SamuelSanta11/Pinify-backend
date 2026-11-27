import { Router } from "express";
import {
    createPostController,
    deletePostController,
    getFeedController,
    getPostController,
    likePostController,
    unlikePostController
} from "../controllers/post.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getFeedController);
router.get("/:id", getPostController);
router.post("/", authMiddleware, createPostController);
router.post("/:id/like", authMiddleware, likePostController);
router.delete("/:id/like", authMiddleware, unlikePostController);
router.delete("/:id", authMiddleware, deletePostController);

export default router;