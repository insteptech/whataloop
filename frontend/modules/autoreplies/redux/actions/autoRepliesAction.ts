import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/axios/axiosInterceptor";


export const addReplies= createAsyncThunk("addReplies", async (payload: any, { rejectWithValue }) => {
  try {
    const response = await api.post("/replies/", payload);
    return response.data;
  } catch (error: any) {
    console.error("Constant Error:", error.response?.data || error.message);
    return rejectWithValue(error.response?.data || error.message);
  }
});

