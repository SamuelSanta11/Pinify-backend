import { Request, Response } from "express";
import { registerUserService } from "../services/auth.services";
import { isValidEmail, isValidPassword } from "../utils/validators";

export const registerUser = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        console.log("Entro al register Controller");

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            res.status(400).json({
                message: "Todos los campos son obligatorios"
            });

            return;
        }

        if (!isValidEmail(email)) {
            res.status(400).json({
                message: "El formato del email no es válido"
            });

            return;
        }

        if (!isValidPassword(password)) {
            res.status(400).json({
                message: "La contraseña no cumple con los requisitos"
            });

            return;
        }

        const user = await registerUserService(
            username,
            email,
            password
        );

        res.status(201).json({
            message: "Registro de usuario exitoso",
            user
        });

    } catch (error: any) {

        console.error(error);

        if (error.code === "23505") {

            if (error.constraint === "users_username_key") {
                res.status(409).json({
                    message: "El username ya está registrado"
                });

                return;
            }

            if (error.constraint === "users_email_key") {
                res.status(409).json({
                    message: "El email ya está registrado"
                });

                return;
            }
        }

        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};