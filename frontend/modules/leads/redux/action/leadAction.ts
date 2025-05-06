import { createAsyncThunk } from "@reduxjs/toolkit";

import api from "@/axios/axiosInterceptor";

export const postLeads = createAsyncThunk("postLeads", async (payload: any) => {
    try{
        const response = await api.post("/lead", payload);
        console.log("kk", response, response.status);
        return response;
    } catch(error){
        return error.response.data
    }
})

export const getLeads = createAsyncThunk(
   "getLeads",
  async (
    { page, limit, search }: { page: number; limit: number; search?: string },
    { rejectWithValue }
  )=> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) queryParams.append("search", search);

      const response = await api.get(`/lead?${queryParams.toString()}`);
      console.log("Response", response);

      return {
        leads: response.data.rows,
        total: response.data.count,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
); 


  
  export const getConstantType = createAsyncThunk("getConstantType", async () => {
    try {
      const response = await api.get("/constant/types");
      console.log("Response:", response.data, response.status);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  });