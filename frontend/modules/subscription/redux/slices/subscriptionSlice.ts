import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { subscribePlan } from "../actions/subscriptionAction";
interface SubscriptionState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: SubscriptionState = {
  loading: false,
  error: null,
  success: false,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    resetSubscriptionState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(subscribePlan.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(subscribePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetSubscriptionState } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
