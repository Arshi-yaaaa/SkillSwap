import axios from "axios";


/*
========================================
AXIOS INSTANCE
========================================
*/

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});


/*
========================================
ADD TOKEN TO EVERY REQUEST
========================================
*/

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;

  },
  (error) => {
    return Promise.reject(error);
  }
);


/*
========================================
HANDLE RESPONSES
========================================
*/

api.interceptors.response.use(

  (response) => {
    return response;
  },

  (error) => {

    if (
      error.response?.status === 401
    ) {

      console.log(
        "Authentication failed"
      );

    }

    return Promise.reject(error);

  }

);


export default api;