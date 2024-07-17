"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, Spin, message, List, Input, Button, Form } from "antd";
import { fetchPostById, createComment } from "@/services/post/postService";

const SinglePostPage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentForm] = Form.useForm();

  const getPost = async (postId: string) => {
    try {
      const data = await fetchPostById(postId);
      setPost(data);
      setLoading(false);
    } catch (error) {
      message.error("Error fetching post");
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (values: any) => {
    try {
      const { content } = values;
      const newComment = await createComment(id as string, content);
      setPost((prevPost: any) => ({
        ...prevPost,
        comments: [...prevPost.comments, newComment],
      }));
      commentForm.resetFields();
      message.success("Comment added successfully");
    } catch (error) {
      message.error("Error adding comment");
    }
  };

  useEffect(() => {
    if (!id) return;
    console.log("Post ID from URL:", id); // Log the ID to the console
    getPost(id as string);
  }, [id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl p-4">
        {loading ? (
          <Spin size="large" />
        ) : (
          post && (
            <Card title={post.title}>
              <p>{post.content}</p>
              <List
                header={<div>Comments</div>}
                dataSource={post.comments}
                renderItem={(comment: any) => (
                  <List.Item>
                    <p>{comment.content}</p>
                  </List.Item>
                )}
              />
              <Form
                form={commentForm}
                onFinish={handleCommentSubmit}
                layout="vertical"
                style={{ marginTop: "20px" }}
              >
                <Form.Item
                  name="content"
                  label="Add a comment"
                  rules={[
                    { required: true, message: "Please enter your comment" },
                  ]}
                >
                  <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Post Comment
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          )
        )}
      </div>
    </div>
  );
};

export default SinglePostPage;
