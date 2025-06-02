import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/axios/axiosInterceptor";
import { headers } from "next/headers";

// Accept a payload object with planId and priceId
export const subscribePlan = createAsyncThunk(
  "subscribePlan",
  async (
    payload: { planId: string; priceId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/subscriptions/", payload, {
        headers: {
          "Content-Type": "application/json",   
        }
      });
      
      return response.data;
    } catch (error: any) {
      // Fallback for different error types
      return rejectWithValue(error?.response?.data || "Subscription failed");
    }
  }
);

export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
 async (whatsappNumber: string, { rejectWithValue }) => {
  try {
    console.log("Sending OTP to:", whatsappNumber);
    
    const cleanedNumber = whatsappNumber.replace(/\D/g, ''); // remove non-digits
    console.log("Sending OTP to:", cleanedNumber);
    
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
    try {
      // Remove all non-digit characters including '+'
      const cleanedNumber = payload.whatsapp_number.replace(/\D/g, '');

      console.log("Verifying OTP for:", cleanedNumber);

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

      return response.data;
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
      name: string;
      description?: string;
      website?: string;
      logo_url?: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      // First request: Create business
      const createResponse = await api.post("/business/", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const businessData = createResponse.data.data;
     

      // Second request: Onboard user
      const onboardPayload = {
        businessName: businessData.name,
        whatsappNumber: businessData.whatsapp_number,
        business_id: businessData.id,
      };

      const onboardResponse = await api.post("/onboarding/onboard", onboardPayload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return {
        createBusiness: createResponse.data,
        onboardUser: onboardResponse.data,
      };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data || "Failed to complete business setup.");
    }
  }
);
