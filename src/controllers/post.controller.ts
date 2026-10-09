import { Request, Response } from "express";
import { createPostService, getFeedService } from "../services/post.services";
import { AuthRequest } from "../middlewares/auth.middleware";

const isValidUrl = (value: string): boolean => {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
};

export const createPostController = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        console.log("Entro al createPost Controller");

        const { image_url, title, description } = req.body;

        if (!image_url || typeof image_url !== "string") {
            res.status(400).json({ message: "La imagen es obligatoria" });
            return;
        }

        if (!isValidUrl(image_url)) {
            res.status(400).json({ message: "La URL de la imagen no es válida" });
            return;
        }

        if (title && (typeof title !== "string" || title.length > 100)) {
            res.status(400).json({ message: "El título no puede superar 100 caracteres" });
            return;
        }

        const post = await createPostService(
            req.userId!,
            image_url,
            title ?? null,
            description ?? null
        );

        res.status(201).json({
            message: "Post creado exitosamente",
            post
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const getFeedController = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        console.log("Entro al getFeed Controller");

        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);

        const posts = await getFeedService(page, limit);

        res.status(200).json({ page, limit, posts });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};