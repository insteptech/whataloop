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
      console.log("Response", response.data, response.status);

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


