// modules/lead/redux/leadSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { postLeads } from "../action/leadAction";

const initialState = {
  leads: [],
  loading: false,
  error: "",
  message: "",
  token: "",
};

const leadSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postLeads.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(postLeads.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload && action.payload.statusCode === 200) {
          state.message = action.payload.message || "Lead posted successfully";
          state.leads.push(action.payload.data); // Add the lead
        } else {
          state.error = action.payload.message || "Failed to post lead";
        }
      })
      .addCase(postLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const leadActions = leadSlice.actions;
export default leadSlice.reducer;
