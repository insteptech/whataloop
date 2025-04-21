import { createAsyncThunk } from "@reduxjs/toolkit";
// import { axiosInstance, withoutAuth } from "../config/axiosInstance";

export const signInCall = createAsyncThunk("sginInCall", async () => {
  return {data:{token:"Ada"}};
});