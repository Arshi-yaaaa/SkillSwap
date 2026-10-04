import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

const AuthContext = createContext();

const API_URL = "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);


  /*
  ========================================
  LOAD SAVED USER
  ========================================
  */

  useEffect(() => {

    const token = localStorage.getItem("token");

    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {

      try {

        setUser(JSON.parse(savedUser));

      } catch (error) {

        console.error(
          "Failed to load saved user:",
          error
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

      }

    }

    setLoading(false);

  }, []);


  /*
  ========================================
  LOGIN
  ========================================
  */

  const login = async (
    email,
    password
  ) => {

    try {

      const response = await axios.post(
        `${API_URL}/auth/login`,
        {
          email,
          password,
        }
      );

      const data = response.data;


      if (data.token) {

        localStorage.setItem(
          "token",
          data.token
        );

      }


      if (data.user) {

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setUser(data.user);

      }


      return data;

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      throw error;

    }

  };


  /*
  ========================================
  REGISTER
  ========================================
  */

  const register = async (
    name,
    email,
    password
  ) => {

    try {

      const response = await axios.post(
        `${API_URL}/auth/register`,
        {
          name,
          email,
          password,
        }
      );

      const data = response.data;


      if (data.token) {

        localStorage.setItem(
          "token",
          data.token
        );

      }


      if (data.user) {

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setUser(data.user);

      }


      return data;

    } catch (error) {

      console.error(
        "Registration error:",
        error
      );

      throw error;

    }

  };


  /*
  ========================================
  UPDATE USER
  ========================================
  
  THIS IS THE IMPORTANT PART.
  
  Whenever Profile is saved, it can call
  updateUser(updatedUser).
  
  That immediately updates:
  
  AuthContext
       ↓
  Dashboard
       ↓
  Navbar
       ↓
  Other components
  */

  const updateUser = (updatedUser) => {

    if (!updatedUser) {
      return;
    }


    setUser(updatedUser);


    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

  };


  /*
  ========================================
  LOGOUT
  ========================================
  */

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setUser(null);

  };


  /*
  ========================================
  CONTEXT
  ========================================
  */

  return (

    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

};


/*
========================================
USE AUTH
========================================
*/

export const useAuth = () => {

  const context = useContext(
    AuthContext
  );


  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );

  }


  return context;

};