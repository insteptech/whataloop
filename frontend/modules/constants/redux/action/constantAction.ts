import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/axios/axiosInterceptor";


export const postConstant = createAsyncThunk("postConstant", async (payload: any, { rejectWithValue }) => {
  try {
    const response = await api.post("/constant/constant", payload);
    return response.data;
  } catch (error: any) {
    console.error("Constant Error:", error.response?.data || error.message);
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchConstants = createAsyncThunk(
  "fetchConstants",
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/constant/types?page=${page}&limit=${limit}`);
      return {
        constantsList: response.data.data.constantType.rows, 
        total: response.data.data.constantType.count,
        totalPages: response.data.data.constantType.totalPages,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const deleteConstant = createAsyncThunk(
  "deleteConstant",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/constant/constantdelete/${id}`);
      return { id, message: response.data.message };
    } catch (error: any) {
      console.error("Delete Constant Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
