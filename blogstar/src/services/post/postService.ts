import { privateAxios } from "@/services/helper/helper";

// Fetch all posts
export const fetchPosts = async () => {
  try {
    const response = await privateAxios.get("/posts");
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

// Fetch a single post by ID
export const fetchPostById = async (id: string) => {
  try {
    const response = await privateAxios.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    throw error;
  }
};

// Create a new post
export const createPost = async (requestBody: {
  title: string;
  content: string;
}) => {
  try {
    const response = await privateAxios.post("/posts", requestBody);
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

// Update a post by ID
export const updatePost = async (
  id: string,
  title: string,
  content: string
) => {
  try {
    const response = await privateAxios.put(`/posts/${id}`, { title, content });
    return response.data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

// Delete a post by ID
export const deletePost = async (id: string) => {
  try {
    const response = await privateAxios.delete(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

// Post a new comment
export const createComment = async (postId: string, content: string) => {
  const response = await privateAxios.post(`/comments`, {
    post_id: postId,
    content,
  });
  return response.data;
};
