import { Request, Response } from "express";
import {
    registerUserService,
    loginUserService,
    getProfileService
} from "../services/auth.services";
import { isValidEmail, isValidPassword } from "../utils/validators";
import { AuthRequest } from "../middlewares/auth.middleware";

export const registerUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        console.log("Entro al register Controller");

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            res.status(400).json({ message: "Todos los campos son obligatorios" });
            return;
        }

        if (!isValidEmail(email)) {
            res.status(400).json({ message: "El formato del email no es válido" });
            return;
        }

        if (!isValidPassword(password)) {
            res.status(400).json({ message: "La contraseña no cumple con los requisitos" });
            return;
        }

        const user = await registerUserService(username, email, password);

        res.status(201).json({
            message: "Registro de usuario exitoso",
            user
        });

    } catch (error: any) {
        console.error(error);

        if (error.code === "23505") {
            if (error.constraint === "users_username_key") {
                res.status(409).json({ message: "El username ya está registrado" });
                return;
            }

            if (error.constraint === "users_email_key") {
                res.status(409).json({ message: "El email ya está registrado" });
                return;
            }
        }

        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const loginUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        console.log("Entro al login Controller");

        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Email y password son obligatorios" });
            return;
        }

        if (!isValidEmail(email)) {
            res.status(400).json({ message: "El formato del email no es válido" });
            return;
        }

        const result = await loginUserService(email, password);

        if (!result) {
            res.status(401).json({ message: "Email o contraseña incorrectos" });
            return;
        }

        res.status(200).json({
            message: "Login exitoso",
            user: result.user,
            token: result.token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const getMe = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        console.log("Entro al getMe Controller");

        const user = await getProfileService(req.userId!);

        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }

        res.status(200).json({ user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};