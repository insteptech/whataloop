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
    async ({ page, limit, search }: { page: number; limit: number; search?: string }) => {
      try {
        const skip = (page - 1) * limit;
  
        const url = search
          ? `https://dummyjson.com/users/search?q=${search}`
          : `https://dummyjson.com/users?limit=${limit}&skip=${skip}`;
  
        const response = await api.get(url);
  
        return {
          users: response.data.users,
          total: response.data.total,
        };
      } catch (error) {
        return error.response?.data;
      }
    }
  );
  
  