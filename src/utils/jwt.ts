import jwt, { JwtPayload } from "jsonwebtoken";

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
    const decoded = jwt.verify(token, getSecret()) as JwtPayload;

    return { id: decoded.id };
};