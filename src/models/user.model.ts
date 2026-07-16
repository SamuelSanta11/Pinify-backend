import pool from "../config/database";

export const createUser = async (
    username: string,
    email: string,
    password: string
) => {
    const result = await pool.query(
        `
        INSERT INTO users (
            username,
            email,
            password
        )
        VALUES ($1, $2, $3)
        RETURNING id, username, email, created_at
        `,
        [username, email, password]
    );

    return result.rows[0];
};