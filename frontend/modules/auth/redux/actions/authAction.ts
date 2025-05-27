import { createAsyncThunk } from "@reduxjs/toolkit";
// import { axiosInstance, withoutAuth } from "../config/axiosInstance";
import api from '@/axios/axiosInterceptor';
import { setToken } from "@/utils/auth";

export const sendOtp = createAsyncThunk("sendOtp", async (payload: any) => {
  try {
     const response = await api.post("auth/send-otp", payload);
          
     return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return error.response.data;
  }
 
});

export const login = createAsyncThunk("login", async (payload: any) => {
  try{
    const response = await api.post("auth/login", payload);   
    if (response.status == 200) {
      setToken(response.data.data.token);
    }
    return response;
  } catch(error){
    return error.response.data;
  }
})


export const verifyOtp = createAsyncThunk("verifyOtp", async (payload: any) => {
  try {
    const response = await api.post("auth/verify-otp", payload);
    
    // if (response.data.statusCode == 200) {
    //   setToken(response.data.token);
    // }
  return response.data;
  } catch (error) {
    return error.response.data;
  }
});

export const register = createAsyncThunk(
  "register",
  async (payload: any, thunkAPI) => {
    try {
      // Create FormData to handle file uploads
      const formData = new FormData();
      formData.append("fullName", payload.fullName);
      formData.append("email", payload.email);
      formData.append("phone", payload.phone);
      formData.append("password", payload.password);

      // Append the photo if available
      if (payload.photo) {
        formData.append("photo", payload.photo); // Ensure this matches backend field name
      }

      // Register the user
      const response = await api.post("/auth/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });

      // Handle onboarding if needed
      if (response?.data?.statusCode === 200) {
        const onboardingPayload = {
          businessName: payload.businessName,
          whatsappNumber: payload.phone,
        };
        await api.post("/onboarding/onboard", onboardingPayload);
      }

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "An error occurred" }
      );
    }
  }
);
