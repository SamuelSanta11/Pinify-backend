import { Request, Response } from "express";
import {
    createPostService,
    deletePostService,
    getFeedService,
    getPostDetailService,
    likePostService,
    unlikePostService
} from "../services/post.services";
import { AuthRequest } from "../middlewares/auth.middleware";

const isValidUrl = (value: string): boolean => {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
};

const parsePositiveSafeInteger = (value: unknown): number | null => {
    if (typeof value !== "string" || !/^\d+$/.test(value)) {
        return null;
    }

    const parsed = Number(value);
    return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
};

export const createPostController = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.userId;
        if (typeof userId !== "number" || !Number.isSafeInteger(userId) || userId <= 0) {
            res.status(401).json({ message: "Usuario no autenticado" });
            return;
        }

        const body = req.body;

        if (!body || typeof body !== "object" || Array.isArray(body)) {
            res.status(400).json({ message: "El cuerpo de la solicitud no es válido" });
            return;
        }

        const { image_url, title, description } = body;

        if (!image_url || typeof image_url !== "string") {
            res.status(400).json({ message: "La imagen es obligatoria" });
            return;
        }

        if (!isValidUrl(image_url)) {
            res.status(400).json({ message: "La URL de la imagen no es válida" });
            return;
        }

        if (
            title !== undefined &&
            title !== null &&
            (typeof title !== "string" || title.length > 100)
        ) {
            res.status(400).json({ message: "El título debe ser texto de máximo 100 caracteres" });
            return;
        }

        if (
            description !== undefined &&
            description !== null &&
            typeof description !== "string"
        ) {
            res.status(400).json({ message: "La descripción debe ser texto" });
            return;
        }

        const post = await createPostService(
            userId,
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
        const page = req.query.page === undefined
            ? 1
            : parsePositiveSafeInteger(req.query.page);
        const requestedLimit = req.query.limit === undefined
            ? 20
            : parsePositiveSafeInteger(req.query.limit);

        if (page === null || requestedLimit === null) {
            res.status(400).json({ message: "La paginación debe usar enteros positivos seguros" });
            return;
        }

        const limit = Math.min(requestedLimit, 50);
        const offset = (page - 1) * limit;

        if (!Number.isSafeInteger(offset)) {
            res.status(400).json({ message: "La página solicitada está fuera de rango" });
            return;
        }

        const posts = await getFeedService(page, limit);

        res.status(200).json({ page, limit, posts });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

const parseId = (value: unknown): number | null => {
    if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
        return null;
    }

    const id = Number(value);
    return Number.isSafeInteger(id) ? id : null;
};

export const getPostController = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const postId = parseId(req.params.id);

        if (!postId) {
            res.status(400).json({ message: "El id del post no es válido" });
            return;
        }

        const post = await getPostDetailService(postId);

        if (!post) {
            res.status(404).json({ message: "Post no encontrado" });
            return;
        }

        res.status(200).json({ post });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const likePostController = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.userId;
        if (typeof userId !== "number" || !Number.isSafeInteger(userId) || userId <= 0) {
            res.status(401).json({ message: "Usuario no autenticado" });
            return;
        }

        const postId = parseId(req.params.id);
        if (!postId) {
            res.status(400).json({ message: "El id del post no es válido" });
            return;
        }

        const result = await likePostService(postId, userId);
        if (result === "not_found") {
            res.status(404).json({ message: "Post no encontrado" });
            return;
        }

        if (result === "already_exists") {
            res.status(409).json({ message: "Ya diste like a este post" });
            return;
        }

        res.status(201).json({ message: "Like agregado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const unlikePostController = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.userId;
        if (typeof userId !== "number" || !Number.isSafeInteger(userId) || userId <= 0) {
            res.status(401).json({ message: "Usuario no autenticado" });
            return;
        }

        const postId = parseId(req.params.id);
        if (!postId) {
            res.status(400).json({ message: "El id del post no es válido" });
            return;
        }

        const result = await unlikePostService(postId, userId);
        if (result === "not_found") {
            res.status(404).json({ message: "Post o like no encontrado" });
            return;
        }

        res.status(200).json({ message: "Like eliminado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const deletePostController = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.userId;
        if (typeof userId !== "number" || !Number.isSafeInteger(userId) || userId <= 0) {
            res.status(401).json({ message: "Usuario no autenticado" });
            return;
        }

        const postId = parseId(req.params.id);

        if (!postId) {
            res.status(400).json({ message: "El id del post no es válido" });
            return;
        }

        const result = await deletePostService(postId, userId);

        if (result === "not_found") {
            res.status(404).json({ message: "Post no encontrado" });
            return;
        }

        if (result === "forbidden") {
            res.status(403).json({ message: "No puedes eliminar un post que no es tuyo" });
            return;
        }

        res.status(200).json({ message: "Post eliminado exitosamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};