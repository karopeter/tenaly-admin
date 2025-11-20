import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const getToken = (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }

    return null;
};

const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getToken();

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;