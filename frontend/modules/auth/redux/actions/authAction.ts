import { createAsyncThunk } from "@reduxjs/toolkit";
// import { axiosInstance, withoutAuth } from "../config/axiosInstance";
import api from '@/axios/axiosInterceptor';
import { setToken } from "@/utils/auth";

// export const sendOtp = createAsyncThunk(
//   "auth/sendOtp",
//   async (payload: { phone: string; full_name?: string }, { rejectWithValue }) => {
//     try {
//       // Remove '+' from the phone number
//       const sanitizedPhone = payload.phone.startsWith("+")
//         ? payload.phone.slice(1)
//         : payload.phone;

//       const modifiedPayload = {
//         ...payload,
//         phone: sanitizedPhone,
//       };

//       const response = await api.post("/auth/send-otp", modifiedPayload);

//       return {
//         data: response.data,
//         status: response.status,
//       };
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || {
//         message: "An error occurred while sending OTP",
//       });
//     }
//   }
// );

export const login = createAsyncThunk("login", async (payload: any) => {
  try{
     const phone = payload.phone.startsWith("+")
        ? payload.phone.slice(1)
        : payload.phone;

        console.log("Sanitized Phone:", phone);
    const response = await api.post("auth/login", {phone: phone});   
console.log("Response from login:", response);
    // if (response.status == 200) {
    //   setToken(response.data.data.token);
    // }
    return response;
  } catch(error){
    return error.response.data;
  }
})


export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (payload: { phone: string; full_name: string }, thunkAPI) => {
    try {
      const sanitizedPhone = payload.phone.startsWith("+")
        ? payload.phone.slice(1)
        : payload.phone;

      const response = await api.post("/auth/signup", {
        phone: sanitizedPhone,
        full_name: payload.full_name
      });
      console.log("Response from sendOtp:", response);
      

      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "An error occurred" }
      );
    }
  }
);
export const resendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (payload: { phone: string; }, thunkAPI) => {
    try {
      const sanitizedPhone = payload.phone.startsWith("+")
        ? payload.phone.slice(1)
        : payload.phone;

      const response = await api.post("/auth/resend-otp", {
        phone: sanitizedPhone,
      });
      console.log("Response from sendOtp:", response);
      

      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "An error occurred" }
      );
    }
  }
);

// export const verifyOtpAndRegister = createAsyncThunk(
//   "auth/verifyOtpAndRegister",
//   async (payload: { phone: string; otp: string }, thunkAPI) => {
//     try {
//       const sanitizedPhone = payload.phone.startsWith("+")
//         ? payload.phone.slice(1)
//         : payload.phone;

//       const response = await api.post("/auth/verify-otp", {
//         phone: sanitizedPhone,
//         otp: payload.otp
//       });
//       console.log("Response from verifyOtpAndRegister:", response);
//       return response;
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data || { message: "An error occurred" }
//       );
//     }
//   }
// );


export const verifyOtpAndRegisterAndLogin = createAsyncThunk(
  "auth/verifyOtpAndRegister",
  async (
    payload: { phone: string; otp: string; mode?: "login" | "register" },
    thunkAPI
  ) => {
    try {
      const sanitizedPhone = payload.phone.startsWith("+")
        ? payload.phone.slice(1)
        : payload.phone;

      const response = await api.post("/auth/verify-otp", {
        phone: sanitizedPhone,
        otp: payload.otp,
      });

      if (response.data?.token) {
        const token = response.data?.token;
        const user = response.data?.user;
        setToken(token);
        thunkAPI.dispatch({
          type: "auth/setUser",
          payload: { token, user },
        });
      }

      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "An error occurred" }
      );
    }
  }
);

