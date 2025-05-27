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
  { data: FormData; token: string },
  { rejectValue: any }
>(
  "auth/updateProfileSelf",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await api.put("/auth/updateprofileself", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Profile update error:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);