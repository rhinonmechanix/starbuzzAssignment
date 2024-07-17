"use client";

import { publicAxios } from "../helper/helper";

export const signup = async (
  username: string,
  email: string,
  password: string
) => {
  const response = await publicAxios.post("/auth/signup", {
    username,
    email,
    password,
  });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await publicAxios.post("/auth/login", { email, password });
  return response.data;
};
