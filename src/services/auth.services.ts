import bcrypt from "bcrypt";
import {
    createUser,
    findUserByEmail,
    findUserById
} from "../models/user.model";
import { generateToken } from "../utils/jwt";

export const registerUserService = async (
    username: string,
    email: string,
    password: string
) => {
    console.log("Entro al register Service");

    const hashedPassword = await bcrypt.hash(password, 10);

    return await createUser(username, email, hashedPassword);
};

export const loginUserService = async (
    email: string,
    password: string
) => {
    console.log("Entro al login Service");

    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
        return null;
    }

    const token = generateToken(user.id);

    return {
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            created_at: user.created_at
        },
        token
    };
};

export const getProfileService = async (userId: number) => {
    console.log("Entro al getProfile Service");

    const user = await findUserById(userId);

    return user ?? null;
};