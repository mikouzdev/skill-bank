import axios from "axios";

export const api = axios.create({
  //   baseURL: "http://localhost:3000/api", // todo: use VITE_API_URL instead
  withCredentials: false,
});
