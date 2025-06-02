import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { subscribePlan, sendOtp, verifyOtp, createBusiness } from "../actions/subscriptionAction";

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
}

const initialState: SubscriptionState = {
  loading: false,
  error: null,
  success: false,

  otpLoading: false,
  otpError: null,
  otpSent: false,

  otpVerifyLoading: false,
  otpVerifyError: null,
  otpVerified: false,

  businessLoading: false,
  businessError: null,
  businessCreated: false,
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
    resetOtpState: (state) => {
      state.otpLoading = false;
      state.otpError = null;
      state.otpSent = false;
    },
    resetOtpVerifyState: (state) => {
      state.otpVerifyLoading = false;
      state.otpVerifyError = null;
      state.otpVerified = false;
    },
    resetBusinessState: (state) => {
      state.businessLoading = false;
      state.businessError = null;
      state.businessCreated = false;
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
      .addCase(sendOtp.pending, (state) => {
        state.otpLoading = true;
        state.otpError = null;
        state.otpSent = false;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.otpLoading = false;
        state.otpSent = true;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.otpError = action.payload as string;
        state.otpSent = false;
      })

      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.otpVerifyLoading = true;
        state.otpVerifyError = null;
        state.otpVerified = false;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.otpVerifyLoading = false;
        state.otpVerified = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.otpVerifyLoading = false;
        state.otpVerifyError = action.payload as string;
        state.otpVerified = false;
      })

      // Create Business
      .addCase(createBusiness.pending, (state) => {
        state.businessLoading = true;
        state.businessError = null;
        state.businessCreated = false;
      })
      .addCase(createBusiness.fulfilled, (state) => {
        state.businessLoading = false;
        state.businessCreated = true;
      })
      .addCase(createBusiness.rejected, (state, action) => {
        state.businessLoading = false;
        state.businessError = action.payload as string;
        state.businessCreated = false;
      });
  },
});

export const {
  resetSubscriptionState,
  resetOtpState,
  resetOtpVerifyState,
  resetBusinessState,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
