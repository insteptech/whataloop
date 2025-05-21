import { createSlice } from "@reduxjs/toolkit";
import { getUsers, deleteUser, updateProfileByAdmin } from "../action/usersAction";

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
      // Get Users
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
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        const deletedUserId = action.payload;
        state.users.rows = state.users.rows.filter((user) => user.id !== deletedUserId);
        state.users.count -= 1;
        state.message = "User deleted successfully";
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to delete user";
      })

      // Update Profile By Admin
      .addCase(updateProfileByAdmin.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.message = "";
      })
      .addCase(updateProfileByAdmin.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload.data;
        
        // Update the user in the users list
        state.users.rows = state.users.rows.map(user => 
          user.id === updatedUser.id ? { ...user, ...updatedUser } : user
        );
        
        state.message = action.payload.message || "User updated successfully";
        state.error = "";
      })
      .addCase(updateProfileByAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to update user";
        state.message = "";
      });
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;