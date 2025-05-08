import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/axios/axiosInterceptor";

export const fetchProfile = createAsyncThunk<any, string>(
  "auth/fetchProfile",
  async (token, { rejectWithValue }) => {
    try {
      const response = await api.get(`/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const updateProfile = createAsyncThunk<
any,
  { data: any; token: string }, 
  { rejectValue: any } 
>(
  "auth/updateProfile",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/auth/updateprofile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);