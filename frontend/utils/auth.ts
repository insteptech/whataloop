import { jwtDecode,JwtPayload } from "jwt-decode";
 
// Define the token key used in localStorage
const TOKEN_KEY = "auth_token";
// Set token in localStorage
export const setToken = (token: string): void => {
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

// Example usage for protected routes
export const isAuthenticated = (): boolean => {
  return isTokenValid();
};