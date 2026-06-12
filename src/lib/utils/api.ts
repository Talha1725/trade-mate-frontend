import axios from "axios"
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token")
        window.location.href = "/"
      }
    }
    return Promise.reject(error)
  },
)

export async function get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await api.get(url, config)
  return response.data
}

export async function post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await api.post(url, data, config)
  return response.data
}

export async function put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await api.put(url, data, config)
  return response.data
}

export async function patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await api.patch(url, data, config)
  return response.data
}

export async function del<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await api.delete(url, config)
  return response.data
}

export default api
