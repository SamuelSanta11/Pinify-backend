import pool from "../config/database";

export const createPost = async (
    userId: number,
    imageUrl: string,
    title: string | null,
    description: string | null
) => {
    const result = await pool.query(
        `
        INSERT INTO posts (user_id, image_url, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING id, user_id, image_url, title, description, created_at
        `,
        [userId, imageUrl, title, description]
    );

    return result.rows[0];
};

export const getPosts = async (limit: number, offset: number) => {
    const result = await pool.query(
        `
        SELECT
            p.id,
            p.image_url,
            p.title,
            p.description,
            p.created_at,
            u.id AS user_id,
            u.username,
            u.avatar_url
        FROM posts p
        JOIN users u ON u.id = p.user_id
        ORDER BY p.created_at DESC
        LIMIT $1 OFFSET $2
        `,
        [limit, offset]
    );

    return result.rows;
};