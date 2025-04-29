import axios from "axios";
import { getToken, isAuthenticated, logout } from "@/utils/auth";
  
const API_URL = "http://localhost:3000/api/v1/";

  
const onRequest = async (config) => {
  if (!isAuthenticated()) {
    if (getToken()) {
      logout();
      // const storedToken = getToken();
      // try {
      //   const rs = await axios.post(`${API_URL}auth/refresh-token`, {
      //     token: storedToken,
      //   });
      //   if (rs && rs.data) {
          
      //     const token = finalresponse.data.token;
      //     const user = finalresponse.data.user;
      //     localStorage.setItem("token", token);
      //     localStorage.setItem("user", JSON.stringify(user));
      //   }
      // } catch (_error) {
      //   logout();
      //   return Promise.reject(_error);
      // }
    }
  }

  config.headers["Authorization"] = `Bearer ${getToken()}`;

  return config;
};

const onRequestError = (error) => {
  return Promise.reject(error);
};

const onResponse = (response) => {
  return response;
};

const onResponseError = async (error) => {
  if (error.response) {
    if (
      error.response.status === 401 &&
      error.response.data.message === "jwt expired"
    ) {
      let storedToken
      if (localStorage.getItem("token")) {
        storedToken = JSON.parse(localStorage.getItem("token"));
      } else {
        // storedToken = document.cookie.split("=")[1]
        document.cookie.split(";").map(item => {
          if (item.split("=")[0].trim() === "token") {
            storedToken = item.split("=")[1]
          }
        })
      }
      try {
        const rs = await axios.post(`${API_URL}auth/refresh-token`, {
          token: storedToken,
        });
        if (rs && rs.data && rs.data.data) {
          const token = rs.data.data.token;
          const user = rs.data.data.user;          
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
        }
        return;
      } catch (_error) {
        return Promise.reject(_error);
      }
    }
  }
  return Promise.reject(error);
};

const setupInterceptorsTo = (axiosInstance) => {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
};

export default setupInterceptorsTo(
  axios.create({
    baseURL: API_URL,
    headers: {
      // "Content-Type": "application/json",
    },
  })
);
 