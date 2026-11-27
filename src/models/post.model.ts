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

export const getPostById = async (id: number) => {
    const result = await pool.query(
        `
        SELECT
            p.id,
            p.image_url,
            p.title,
            p.description,
            p.created_at,
            (SELECT COUNT(*)::int FROM likes l WHERE l.post_id = p.id) AS like_count,
            u.id AS user_id,
            u.username,
            u.avatar_url
        FROM posts p
        JOIN users u ON u.id = p.user_id
        WHERE p.id = $1
        `,
        [id]
    );

    return result.rows[0];
};

export const createPostLike = async (postId: number, userId: number) => {
    const result = await pool.query(
        `
        INSERT INTO likes (user_id, post_id)
        SELECT $1, p.id
        FROM posts p
        WHERE p.id = $2
          AND NOT EXISTS (
              SELECT 1
              FROM likes l
              WHERE l.user_id = $1 AND l.post_id = p.id
          )
        ON CONFLICT DO NOTHING
        RETURNING post_id
        `,
        [userId, postId]
    );

    return result.rows.length > 0;
};

export const deletePostLike = async (postId: number, userId: number) => {
    const result = await pool.query(
        "DELETE FROM likes WHERE post_id = $1 AND user_id = $2 RETURNING post_id",
        [postId, userId]
    );

    return result.rows.length > 0;
};

export const deletePostById = async (id: number, userId: number) => {
    const result = await pool.query(
        "DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING id",
        [id, userId]
    );

    return result.rows.length > 0;
};