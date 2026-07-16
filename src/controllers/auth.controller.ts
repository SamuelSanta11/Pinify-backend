import { Request, Response } from "express";
import { registerUserService } from "../services/auth.services";

export const registerUser = async (
    req: Request,
    res: Response
): Promise<void> => {

    console.log("Entro al register Controller");

    const { username, email, password } = req.body;

    const user = await registerUserService(
        username,
        email,
        password
    );

    res.status(201).json({
        message: "Registro de usuario exitoso",
        user
    });
};