import axios from "axios";

const api = axios.create({
  baseURL:
    // "http://localhost:8000/api",
    "http://10.9.97.64:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;