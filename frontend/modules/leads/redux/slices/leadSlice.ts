// modules/lead/redux/leadSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { deleteLead, getLeads, postLeads } from "../action/leadAction";

const initialState = {
  leads: [],
  total: 0, 
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
          state.leads.push(action.payload.data);
        } else {
          state.error = action.payload.message || "Failed to post lead";
        }
      })
      .addCase(postLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(getLeads.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.leads;
        state.total = action.payload.total; 
      })
      .addCase(getLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Something went wrong";
      })
      .addCase(deleteLead.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload?.id;
        if (deletedId) {
          state.leads = state.leads.filter((lead: any) => lead.id !== deletedId);
        }
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete lead";
      });
      
  },
});

export const leadActions = leadSlice.actions;
export default leadSlice.reducer;
