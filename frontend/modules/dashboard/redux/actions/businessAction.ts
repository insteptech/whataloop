import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/axios/axiosInterceptor";
import { headers } from "next/headers";
import { getRefreshToken, getToken, logout, setToken } from "@/utils/auth";
import { useDispatch } from "react-redux";

export const getUsersBusinessExist = createAsyncThunk(
  "business/getUsersBusinessExist",
  async (user_id: string, { rejectWithValue }) => {
    try {
      const response = await api.get("/business/check/" + user_id, );

      return response.data; 
    } catch (error: any) {
      return rejectWithValue(error?.response?.data || "Failed to fetch subscription plans");
    }
  }
);
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
 async (whatsappNumber: string, { rejectWithValue }) => {
  try {
    
    const cleanedNumber = whatsappNumber.replace(/\D/g, ''); // remove non-digits
    
    const response = await api.post(
      "/business/request-otp",
      { whatsapp_number: cleanedNumber }, // send cleaned number string
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error?.response?.data || "Failed to send OTP");
  }
}
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (
    payload: { whatsapp_number: string; otp: string },
    { rejectWithValue }
  ) => {
    // const dispatch = useDispatch()
    try {
      // Remove all non-digit characters including '+'

      const cleanedNumber = payload.whatsapp_number.replace(/\D/g, ''); // remove non-digits

      const response = await api.post(
        "/business/verify-otp",
        {
         whatsapp_number: cleanedNumber,
          otp: payload.otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
     
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data || "Failed to verify OTP");
    }
  }
);


export const createBusiness = createAsyncThunk(
  "business/create",
  async (
    payload: {
      user_id: string;
      whatsapp_number: string;
      business_name: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {

      
      const response = await api.post("/business/connect", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // // Optional second API call (currently commented)
      // const onboardPayload = {
      //   businessName: businessData.name,
      //   whatsappNumber: businessData.whatsapp_number,
      //   business_id: businessData.id,
      // };

      // const onboardResponse = await api.post("/onboarding/onboard", onboardPayload, {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      return {
        data: response
        // onboardUser: onboardResponse.data,
      };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data || "Failed to complete business setup.");
    }
  }
);
// Inside your existing file with other createAsyncThunks

export const addBusinessInfo = createAsyncThunk(
  "business/addBusinessInfo",
  async (
    payload: {
      step?: "step3" | "step4";
      businessId: string;
      industry?: string;
      website?: string;
      welcome_message?: string;
    },
    { rejectWithValue }
  ) => {
    console.log('Step', payload.step)
    try {
      const response = await api.post("/business/update-info", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (payload.step === 'step4') {
        window.location.reload();
      }
      console.log(response, 'Add Business response ')
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data || "Failed to update business info");
    }
  }
);
