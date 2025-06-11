import { createAsyncThunk } from "@reduxjs/toolkit";

import api from "@/axios/axiosInterceptor";

export const postLeads = createAsyncThunk(
  "postLeads",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post("/lead", payload);
      return response.data;
    } catch (error: any) {
      // Use rejectWithValue to properly format the error
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getLeads = createAsyncThunk(
  "getLeads",
  async (
    {
      page,
      limit,
      search,
      sort,
      order,
      role,
    }: {
      page: number;
      limit: number;
      search?: string;
      sort?: string;
      order?: string;
      role?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) queryParams.append("search", search);
      if (sort) queryParams.append("sort", sort);
      if (order) queryParams.append("order", order);
      if (role) queryParams.append("role", role); 

      const response = await api.get(`/lead?${queryParams.toString()}`);
     

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
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  });

  export const deleteLead = createAsyncThunk(
    "deleteLead",
    async (id: string, { rejectWithValue }) => {
      try {
        const response = await api.delete(`/lead/${id}`);
        return { id, message: response.data?.message || "Deleted successfully" };
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );
  

export const updateLead = createAsyncThunk(
  "updateLead",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/lead/${id}`, data);
      return response.data.updatedLead;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getChat = createAsyncThunk(
  "getChat",
  async (leadId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/lead/${leadId}/thread`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to load chat.");
    }
  }
);

export const postMessage = createAsyncThunk(
  "postMessage",
  async (
    payload: {
      lead_id: string;
      sender_phone_number: string;
      receiver_phone_number: string;
      message_content: string;
      message_type: "incoming" | "outgoing";
      status: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/message", payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to send message.");
    }
  }
);

