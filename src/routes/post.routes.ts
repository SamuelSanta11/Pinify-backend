import { Router } from "express";
import {
    createPostController,
    deletePostController,
    getFeedController,
    getPostController
} from "../controllers/post.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getFeedController);
router.get("/:id", getPostController);
router.post("/", authMiddleware, createPostController);
router.delete("/:id", authMiddleware, deletePostController);

export default router;