import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscriber: (() => void)[] = [];

const handleLogout = () => {
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};
const subscribeTokenRefresh = (cb: () => void) => {
  refreshSubscriber.push(cb);
};
const onRefreshSuccess = () => {
  refreshSubscriber.forEach((cb) => cb());
  refreshSubscriber = [];
};
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh(() => {
            resolve(axiosInstance(originalRequest));
          });
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const res = await axiosInstance.post(
          "/refresh-token",
          {},
          { withCredentials: true }
        );
        isRefreshing = false;

        onRefreshSuccess();
        return axiosInstance(originalRequest);
      } catch (error) {
        isRefreshing = false;
        refreshSubscriber = [];
        handleLogout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
