import axios from "axios";
import { getAuthData } from "@/Utils/utils";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const publicAxios = axios.create({
  baseURL: BASE_URL,
});

export const privateAxios = axios.create({
  baseURL: BASE_URL,
});

privateAxios.interceptors.request.use(
  (config) => {
    const token = getAuthData()?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No token found");
    }

    return config;
  },
  (error) => {
    console.error("Interceptor error:", error); // Debugging line
    return Promise.reject(error);
  }
);
