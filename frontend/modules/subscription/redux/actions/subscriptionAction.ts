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
