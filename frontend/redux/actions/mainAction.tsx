import { createAsyncThunk } from "@reduxjs/toolkit";
import api from '@/axios/axiosInterceptor'; 

export const getUserDetail = createAsyncThunk("getUserDetail", async (id: any) => {
  try {
     const response = await api.get(`users/${id}`);
  return response.data;
  } catch (error) {
    return error.response.data;
  }
});