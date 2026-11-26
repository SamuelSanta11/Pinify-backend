import jwt from "jsonwebtoken";

const getSecret = (): string => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET no está definido en el .env");
    }

    return secret;
};

export const generateToken = (userId: number): string => {
    return jwt.sign({ id: userId }, getSecret(), { expiresIn: "7d" });
};

export const verifyToken = (token: string): { id: number } => {
    const decoded = jwt.verify(token, getSecret());

    if (typeof decoded !== "object" || decoded === null) {
        throw new Error("El token no contiene un payload válido");
    }

    const id = decoded.id;
    if (typeof id !== "number" || !Number.isSafeInteger(id) || id <= 0) {
        throw new Error("El token no contiene un ID de usuario válido");
    }

    return { id };
};