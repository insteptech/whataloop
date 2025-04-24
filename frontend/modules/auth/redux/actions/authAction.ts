import { createAsyncThunk } from "@reduxjs/toolkit";
// import { axiosInstance, withoutAuth } from "../config/axiosInstance";
import api from '@/axios/axiosInterceptor';
import { setToken } from "@/utils/auth";

export const sendOtp = createAsyncThunk("sendOtp", async (payload: any) => {
  try {
     const response = await api.post("auth/send-otp", payload);
     console.log("iii", response.data);
     
  return response.data;
  } catch (error) {
    return error.response.data;
  }
 
});

export const login = createAsyncThunk("login", async (payload: any) => {
  try{
    const response = await api.post("auth/login", payload);
    console.log("login", response);
    console.log("kk", response.data);
    
    
    return response.data;
  } catch(error){
    return error.response.data;
  }
})

export const verifyOtp = createAsyncThunk("verifyOtp", async (payload: any) => {
  try {
    const response = await api.post("users/verify-otp", payload);
    if (response.data.statusCode == 200) {
      setToken(response.data.token);
    }
  return response.data;
  } catch (error) {
    return error.response.data;
  }
});

export const register = createAsyncThunk("register", async (payload: any) => {
  try{
    const response = await api.post("auth/register", payload);
    return response.data;
  } catch(error){
    return error.response.data
  }
})
 