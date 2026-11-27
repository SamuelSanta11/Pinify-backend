import {
    createPost,
    createPostLike,
    deletePostById,
    deletePostLike,
    getPostById,
    getPosts
} from "../models/post.model";

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
export const getPostDetailService = async (postId: number) => {
    return (await getPostById(postId)) ?? null;
};

export const likePostService = async (postId: number, userId: number) => {
    const post = await getPostById(postId);
    if (!post) {
        return "not_found";
    }

    const created = await createPostLike(postId, userId);
    if (created) {
        return "created";
    }

    return (await getPostById(postId)) ? "already_exists" : "not_found";
};

export const unlikePostService = async (postId: number, userId: number) => {
    const post = await getPostById(postId);
    if (!post) {
        return "not_found";
    }

    const deleted = await deletePostLike(postId, userId);
    return deleted ? "deleted" : "not_found";
};

export const deletePostService = async (postId: number, userId: number) => {
    const deleted = await deletePostById(postId, userId);

    if (deleted) {
        return "deleted";
    }

    const post = await getPostById(postId);
    if (!post) {
        return "not_found";
    }

    return "forbidden";
};