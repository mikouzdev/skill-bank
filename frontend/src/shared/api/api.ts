import axios from "axios";

export const api = axios.create({
  baseURL:
    "https://spankkiserver-etfjdve9dtc3bafx.northeurope-01.azurewebsites.net", // todo: use VITE_API_URL instead
  withCredentials: false,
});

// attach token to requests automatically, if it exists.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
