import { createPost, getPosts } from "../models/post.model";

export const createPostService = async (
    userId: number,
    imageUrl: string,
    title: string | null,
    description: string | null
) => {
    console.log("Entro al createPost Service");

    return await createPost(userId, imageUrl, title, description);
};

export const getFeedService = async (page: number, limit: number) => {
    console.log("Entro al getFeed Service");

    const offset = (page - 1) * limit;

    return await getPosts(limit, offset);
};