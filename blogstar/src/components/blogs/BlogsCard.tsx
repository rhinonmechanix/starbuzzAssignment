import React from "react";
import { Post } from "@/interfaces/Post";

interface BlogsCardProps {
  post: Post;
  handleCardClick: (id: string) => void;
  showUpdateModal: (post: Post) => void;
  handleDelete: (id: string) => void;
}

const BlogsCard: React.FC<BlogsCardProps> = ({
  post,
  handleCardClick,
  showUpdateModal,
  handleDelete,
}) => {
  return (
    <div
      className="p-5 h-40 bg-blue-100 flex flex-col justify-between cursor-pointer rounded-lg hover:shadow-xl text-black"
      onClick={() => handleCardClick(post._id)}
      style={{ cursor: "pointer" }}
    >
      <div className="flex flex-col gap-2">
        <p className="font-bold text-lg">{post.title}</p>
        <p>
          {post.content
            ? `${post.content.substring(0, 70)}...`
            : "No content available"}
        </p>
      </div>
      <div className="flex items-center justify-end gap-5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            showUpdateModal(post);
          }}
          className="px-2 py-1 bg-blue-200 rounded-md text-blue-950 hover:bg-blue-400 hover:text-white"
        >
          Update
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(post._id);
          }}
          className="px-2 py-1 bg-red-200 rounded-md text-red-950 hover:bg-red-400 hover:text-white"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default BlogsCard;
