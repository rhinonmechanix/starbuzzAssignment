"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, List, message, Spin, Modal, Form, Input, Button } from "antd";
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
} from "@/services/post/postService";

const BlogsPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [currentPost, setCurrentPost] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
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

    getPosts();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const showUpdateModal = (post: any) => {
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
      console.log("Request body:", requestBody); // Debugging line
      await createPost(requestBody);
      message.success("Post created successfully");
      setIsModalVisible(false);
      form.resetFields();
      const data = await fetchPosts();
      setPosts(data);
    } catch (error) {
      message.error("Error creating post");
    }
  };

  const handleUpdateOk = async () => {
    try {
      const values = await updateForm.validateFields();
      const requestBody = {
        title: values.title,
        content: values.content,
      };
      console.log("Request body:", requestBody); // Debugging line
      await updatePost(currentPost._id, values.title, values.content);
      message.success("Post updated successfully");
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      setCurrentPost(null);
      const data = await fetchPosts();
      setPosts(data);
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
          const data = await fetchPosts();
          setPosts(data);
        } catch (error) {
          message.error("Error deleting post");
        }
      },
    });
  };

  const handleCardClick = (id: string) => {
    router.push(`/blogs/${id}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl p-4">
        {loading ? (
          <Spin size="large" />
        ) : (
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={[{ static: true }, ...posts]}
            renderItem={(post) =>
              post.static ? (
                <List.Item>
                  <Card
                    title="Create New Post"
                    onClick={showModal}
                    style={{ cursor: "pointer" }}
                  >
                    <p>Click here to create a new post</p>
                  </Card>
                </List.Item>
              ) : (
                <List.Item>
                  <Card
                    title={post.title}
                    onClick={() => handleCardClick(post._id)}
                    style={{ cursor: "pointer" }}
                    extra={
                      <p className="w-6 h-6 rounded-full flex items-center justify-center bg-red-500 text-white text-xs">
                        01
                      </p>
                    }
                  >
                    <p>{post.content.substring(0, 100)}...</p>
                    <Button
                      type="link"
                      onClick={(e) => {
                        e.stopPropagation();
                        showUpdateModal(post);
                      }}
                    >
                      Update
                    </Button>
                    <Button
                      type="link"
                      danger
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(post._id);
                      }}
                    >
                      Delete
                    </Button>
                  </Card>
                </List.Item>
              )
            }
          />
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
