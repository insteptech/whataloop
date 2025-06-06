import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  subscribePlan,
  
  getSubscriptionPlans,
} from "../actions/subscriptionAction";

interface SubscriptionState {
  loading: boolean;
  error: string | null;
  success: boolean;

  otpLoading: boolean;
  otpError: string | null;
  otpSent: boolean;

  otpVerifyLoading: boolean;
  otpVerifyError: string | null;
  otpVerified: boolean;

  businessLoading: boolean;
  businessError: string | null;
  businessCreated: boolean;

  userBusinessExists:boolean;

  plansLoading: boolean;
  plansError: string | null;
  plans: any[]; 
}

const initialState: SubscriptionState = {
  plansLoading: false,
  plansError: null,
  plans: [],
  loading: false,
  error: "",
  success: false,
  otpLoading: false,
  otpError: "",
  otpSent: false,
  otpVerifyLoading: false,
  otpVerifyError: "",
  otpVerified: false,
  businessLoading: false,
  businessError: "",
  businessCreated: false,
  userBusinessExists: false
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
    resetPlansState: (state) => {
      state.plansLoading = false;
      state.plansError = null;
      state.plans = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Subscribe Plan
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
      })

      // Send OTP
      // Get Subscription Plans
      .addCase(getSubscriptionPlans.pending, (state) => {
        state.plansLoading = true;
        state.plansError = null;
      })
      .addCase(getSubscriptionPlans.fulfilled, (state, action) => {
        state.plansLoading = false;
        state.plans = action.payload;
      })
      .addCase(getSubscriptionPlans.rejected, (state, action) => {
        state.plansLoading = false;
        state.plansError = action.payload as string;
      })
      
  },
});

export const {
  resetSubscriptionState,
  resetPlansState,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
