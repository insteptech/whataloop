import { jwtDecode,JwtPayload } from "jwt-decode";
import { ApiError } from "next/dist/server/api-utils";
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from '@/axios/axiosInterceptor'; 
 
// Define the token key used in localStorage
const TOKEN_KEY = "auth_token";
// Set token in localStorage
export const setToken = (token: string): void => {
  console.log("token", token)
  localStorage.setItem(TOKEN_KEY, token);
};

// Get token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Remove token from localStorage (logout)
export const logout = (): void => {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/";
};
 

// Verify token expiry
export const isTokenValid = (): boolean => {
  const token = getToken();
  if (!token) return false;

try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return decoded.exp ? decoded.exp > currentTime : false;
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
};

// Decode token to get user information
export const getDecodedToken = (): JwtPayload | null => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
export const getRefreshToken = createAsyncThunk("getRefreshToken", async () => {

  const token = getToken();
  try {
     const response = await api.post(`/auth/refresh-token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // setToken(response.payload)
      return(
        response.data.token.token
      )
  } catch (error) {
    return error.response.data;
  }
});
// Example usage for protected routes
export const isAuthenticated = (): boolean => {
  return isTokenValid();
};