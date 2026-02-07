import axios from "axios";

const axiosInstance = axios.create({
  // https://backend-ecommerce-node.vercel.app/
  baseURL:
    import.meta.mode === "development" ? "http://localhost:5000/api" : "https://backend-ecommerce-node.vercel.app/api",
  withCredentials: true, // send cookies to the server
});

export default axiosInstance;
