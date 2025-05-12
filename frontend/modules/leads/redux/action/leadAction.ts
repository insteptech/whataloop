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
    { page, limit, search, sort, order }: { page: number; limit: number; search?: string; sort?: string; order?: string },
    { rejectWithValue }
  )=> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) queryParams.append("search", search);
      if (sort) queryParams.append("sort", sort);
      if (order) queryParams.append("order", order);

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

  export const deleteLead = createAsyncThunk(
    "deleteLead",
    async (id: string, { rejectWithValue, getState }) => {
      try {
        const response = await api.delete(`/lead/${id}`);
        return { id, message: response.data?.message || "Deleted successfully" };
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );
  

 interface UpdateLeadArgs {
  id: string;
  formData: any;
}

export const updateLead = createAsyncThunk(
  "updateLead",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/lead/${id}`, data);
      return response.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

  