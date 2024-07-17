"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { message, Spin, Modal, Form, Input, Button } from "antd";
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
} from "@/services/post/postService";
import BlogsCard from "@/components/blogs/BlogsCard";
import { Post } from "@/interfaces/Post";
import Cookies from "js-cookie";

const BlogsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const router = useRouter();

  const getPosts = async () => {
    try {
      const data = await fetchPosts();
      setPosts(data);
      setLoading(false);
    } catch (error) {
      message.error("Error fetching posts");
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const showUpdateModal = (post: Post) => {
    setCurrentPost(post);
    updateForm.setFieldsValue({
      title: post.title,
      content: post.content,
    });
    setIsUpdateModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const requestBody = {
        title: values.title,
        content: values.content,
      };
      await createPost(requestBody);
      message.success("Post created successfully");
      setIsModalVisible(false);
      form.resetFields();
      getPosts(); // Fetch updated posts
    } catch (error) {
      message.error("Error creating post");
    }
  };

  const handleUpdateOk = async () => {
    try {
      const values = await updateForm.validateFields();
      if (currentPost) {
        await updatePost(currentPost._id, values.title, values.content);
        message.success("Post updated successfully");
        setIsUpdateModalVisible(false);
        updateForm.resetFields();
        setCurrentPost(null);
        getPosts(); // Fetch updated posts
      }
    } catch (error) {
      message.error("Error updating post");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpdateCancel = () => {
    setIsUpdateModalVisible(false);
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this post?",
      onOk: async () => {
        try {
          await deletePost(id);
          message.success("Post deleted successfully");
          getPosts(); // Fetch updated posts
        } catch (error) {
          message.error("Error deleting post");
        }
      },
    });
  };

  const handleCardClick = (id: string) => {
    router.push(`/blogs/${id}`);
  };

  const logout = () => {
    Cookies.remove("token");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="text-black h-16 w-full flex justify-between items-center max-w-4xl">
        <div className="text-3xl font-bold font-serif text-orange-600">
          Blogstar
        </div>
        <div className="flex gap-5 items-center">
          <div
            className="px-10 py-2 rounded-lg bg-blue-600 text-white font-bold cursor-pointer"
            onClick={showModal}
          >
            Create a blog
          </div>
          <div
            className="px-10 py-2 rounded-lg bg-blue-200 text-black font-bold cursor-pointer"
            onClick={logout}
          >
            log Out
          </div>
        </div>
      </div>
      <div className="w-full p-4 h-full flex justify-center max-w-6xl">
        {loading ? (
          <Spin size="large" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {posts.map((post) => (
              <div key={post._id}>
                <BlogsCard
                  post={post}
                  handleCardClick={handleCardClick}
                  showUpdateModal={showUpdateModal}
                  handleDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal
        title="Create New Post"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Create
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter the title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: "Please enter the content" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Update Post"
        visible={isUpdateModalVisible}
        onOk={handleUpdateOk}
        onCancel={handleUpdateCancel}
        footer={[
          <Button key="back" onClick={handleUpdateCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpdateOk}>
            Update
          </Button>,
        ]}
      >
        <Form form={updateForm} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter the title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: "Please enter the content" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BlogsPage;
