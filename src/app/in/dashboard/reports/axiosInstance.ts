import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "", // Use relative URLs for Next.js API routes
});

export default axiosInstance;
