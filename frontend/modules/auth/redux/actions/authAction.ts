import { createAsyncThunk } from "@reduxjs/toolkit";
// import { axiosInstance, withoutAuth } from "../config/axiosInstance";
import api from '@/axios/axiosInterceptor';
import { setToken } from "@/utils/auth";

export const sendOtp = createAsyncThunk("sendOtp", async (payload: any) => {
  try {
     const response = await api.post("auth/send-otp", payload);
     console.log("kk", response.data, response.status);
          
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
    console.log("resp", response);
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
    console.log("token", response.data.token);
    
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
      console.log('payload:--------', payload);
      const data = {
        fullName: payload.fullName,
            email:payload.email,
            phone:payload.phone,
            password:payload.password
      }
      const response = await api.post("/auth/signup", data);
console.log('response:-----',response?.data?.statusCode);


      if (response?.data?.statusCode === 200) {
        const onboardingPayload = {
          businessName: payload.businessName,
          whatsappNumber: payload.phone,
          // userId: userData?.data?.id || userData?.user?.id,
        };
        console.log('onboardingPayload:----', onboardingPayload);
        
        await api.post("/onboarding/onboard", onboardingPayload);
      }

      // return userData;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "An error occurred" }
      );
    }
  }
);
