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


export const getSubscriptionPlans = createAsyncThunk(
  "subscriptions/getPlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/subscriptionPlan");
      return response.data; 
    } catch (error: any) {
      return rejectWithValue(error?.response?.data || "Failed to fetch subscription plans");
    }
  }
);

