import bcrypt from "bcrypt";
import { createUser } from "../models/user.model";

export const registerUserService = async (
    username: string,
    email: string,
    password: string
) => {

    console.log("Entro al register Service");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(
        username,
        email,
        hashedPassword
    );

    return user;
};