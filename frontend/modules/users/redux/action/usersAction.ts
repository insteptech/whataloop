import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/axios/axiosInterceptor";

export const getUsers = createAsyncThunk(
  "auth/getUsers",
  async (
    {
      page,
      pageSize,
      search,
      sort = "createdAt", // Default sort field
      order = "DESC", // Default sort order
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
      // Construct query parameters based on passed arguments
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        sort,
        order,
      });

      if (search) queryParams.append("search", search); // If search query is provided, append it

      // Send the GET request to the API with query parameters
      const response = await api.get(`/auth/users?${queryParams.toString()}`);
      console.log("Response", response.data, response.status);

      // Destructure rows and totalRecords from the response data
      const { rows, totalRecords } = response.data.data;

      // Return the necessary data for the Redux store
      return {
        rows,
        totalRecords,
      };
    } catch (error: any) {
      // In case of an error, return a rejected value with an error message
      return rejectWithValue(error.response?.data || "Failed to fetch users");
    }
  }
);
