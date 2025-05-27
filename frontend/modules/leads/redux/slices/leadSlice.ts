import { createSlice } from "@reduxjs/toolkit";
import { deleteLead, getLeads, postLeads, updateLead } from "../action/leadAction";

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
      // Post Lead
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

      // Get Leads
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

      // Delete Lead
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
      })

      // ✅ Update Lead
      .addCase(updateLead.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
  .addCase(updateLead.fulfilled, (state, action) => {
  state.loading = false;
  console.log('Update lead fulfilled:', action.payload);
  // Check if payload exists and has the expected structure
  if (action.payload) {
    const updatedLead = action.payload;
    
    // Find and replace the lead in the array
    const index = state.leads.findIndex(lead => lead.id === updatedLead.id);
    if (index !== -1) {
      state.leads[index] = updatedLead;
    }
    
    state.message = "Lead updated successfully";
  }
})
      .addCase(updateLead.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || "Failed to update lead";
      });
  },
});

export const leadActions = leadSlice.actions;
export default leadSlice.reducer;
