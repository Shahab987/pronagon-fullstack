import axios from "axios";

// Create an instance of Axios with default configuration
const axiosApi = axios.create({
  withCredentials: true,
});

export default axiosApi;
