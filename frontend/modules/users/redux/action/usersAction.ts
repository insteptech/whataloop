import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/axios/axiosInterceptor";

export const getUsers = createAsyncThunk(
  "auth/getUsers",
  async (
    {
      page,
      pageSize,
      search,
      sort = "createdAt", 
      order = "DESC", 
    }: {
      page: number;
      pageSize: number;
      search?: string;
      sort?: string;
      order?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        sort,
        order,
      });

      if (search) queryParams.append("search", search); 

      const response = await api.get(`/auth/users?${queryParams.toString()}`);

      const { rows, totalRecords } = response.data.data;

      return {
        rows,
        totalRecords,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch users");
    }
  }
);
export const deleteUser = createAsyncThunk(
  "auth/deleteuser",
  async (
    userId: string,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.delete(`/auth/deleteuser/${userId}`);

      if (response.status === 200) {
        return {
          userId,
          message: response.data.message || "User deleted successfully",
        };
      } else {
        return rejectWithValue(response.data.message || "Failed to delete user");
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete user");
    }
  }
);

export const updateProfileByAdmin = createAsyncThunk(
  "auth/updateProfileByAdmin",
  async (
    { userId, updateData, userRole }: { userId: string; updateData: any; userRole: string },
    { rejectWithValue, getState }
  ) => {
    try {
      
      const token = localStorage.getItem('auth_token');

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await api.put(`/auth/updateprofilebyadmin/${userId}`, updateData, userRole,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Update error:", error);
      if (error.response) {
        return rejectWithValue(error.response.data.message || error.response.data);
      }
      return rejectWithValue(error.message || "Failed to update user");
    }
  }
);