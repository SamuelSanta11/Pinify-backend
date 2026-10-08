import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthRequest extends Request {
    userId?: number;
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Token no proporcionado" });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = verifyToken(token);
        req.userId = payload.id;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido o expirado" });
    }
};