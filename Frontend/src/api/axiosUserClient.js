import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});
//Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    if (originalRequest.url.includes("/user/refresh")) {
      return Promise.reject(error);
    }

    //if access token expired
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await api.get("/user/refresh"); //backend sets new cookie
        return api(originalRequest); //retry the original request
      } catch (refreshError) {
        console.log("Refresh failed,logging out");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
