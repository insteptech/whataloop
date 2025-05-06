import { createSlice } from "@reduxjs/toolkit";
import { getUsers } from "../action/usersAction";

const initialState = {
  users: {
    rows: [],
    count: 0,
  },
  loading: false,
  error: "",
  message: "",
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = {
          rows: action.payload?.rows || [],
          count: action.payload?.totalRecords || 0,
        };
        state.message = "Users fetched successfully";
        state.error = "";
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Something went wrong";
      });
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
