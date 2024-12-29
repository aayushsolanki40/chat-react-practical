import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3050",
  withCredentials: true,
});

export default axiosInstance;
