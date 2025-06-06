// src/modules/business/redux/slices/businessOnboardingSlice.ts

import { createSlice } from "@reduxjs/toolkit";
import {
  getUsersBusinessExist,
  sendOtp,
  verifyOtp,
  createBusiness,
  addBusinessInfo,
} from "@/modules/dashboard/redux/actions/businessAction";

interface BusinessOnboardingState {
  // Check if user has existing business
  exists: boolean | null;
  existsLoading: boolean;
  existsError: string | null;

  // OTP handling
  otpSent: boolean;
  otpSending: boolean;
  otpError: string | null;

  // OTP verification
  otpVerified: boolean;
  verifyingOtp: boolean;
  otpVerificationError: string | null;

  // Business creation
  businessCreated: boolean;
  creatingBusiness: boolean;
  createBusinessError: string | null;
  businessId: string | null;

  // Business info update
  infoUpdated: boolean;
  updatingInfo: boolean;
  updateInfoError: string | null;
}

const initialState: BusinessOnboardingState = {
  // Exists check
  exists: null,
  existsLoading: false,
  existsError: null,

  // OTP
  otpSent: false,
  otpSending: false,
  otpError: null,

  // OTP Verification
  otpVerified: false,
  verifyingOtp: false,
  otpVerificationError: null,

  // Business creation
  businessCreated: false,
  creatingBusiness: false,
  createBusinessError: null,
  businessId: null,

  // Info update
  infoUpdated: false,
  updatingInfo: false,
  updateInfoError: null,
};

const businessOnboardingSlice = createSlice({
  name: "businessOnboarding",
  initialState,
  reducers: {
    resetBusinessOnboardingState: (state) => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    // getUsersBusinessExist
    builder.addCase(getUsersBusinessExist.pending, (state) => {
      state.existsLoading = true;
      state.existsError = null;
    });
    builder.addCase(getUsersBusinessExist.fulfilled, (state, action) => {
  state.existsLoading = false;
  state.exists = action.payload.exists;
  state.businessId = action.payload?.data?.id || null; 
});
    builder.addCase(getUsersBusinessExist.rejected, (state, action) => {
      state.existsLoading = false;
      state.existsError = action.payload as string;
    });

    // sendOtp
    builder.addCase(sendOtp.pending, (state) => {
      state.otpSending = true;
      state.otpError = null;
      state.otpSent = false;
    });
    builder.addCase(sendOtp.fulfilled, (state) => {
      state.otpSending = false;
      state.otpSent = true;
    });
    builder.addCase(sendOtp.rejected, (state, action) => {
      state.otpSending = false;
      state.otpError = action.payload as string;
    });

    // verifyOtp
    builder.addCase(verifyOtp.pending, (state) => {
      state.verifyingOtp = true;
      state.otpVerificationError = null;
      state.otpVerified = false;
    });
    builder.addCase(verifyOtp.fulfilled, (state) => {
      state.verifyingOtp = false;
      state.otpVerified = true;
    });
    builder.addCase(verifyOtp.rejected, (state, action) => {
      state.verifyingOtp = false;
      state.otpVerificationError = action.payload as string;
    });

    // createBusiness
    builder.addCase(createBusiness.pending, (state) => {
      state.creatingBusiness = true;
      state.createBusinessError = null;
      state.businessCreated = false;
      
    });
    builder.addCase(createBusiness.fulfilled, (state, action) => {
      state.creatingBusiness = false;
      state.businessCreated = true;
    });
    builder.addCase(createBusiness.rejected, (state, action) => {
      state.creatingBusiness = false;
      state.createBusinessError = action.payload as string;
    });

    // addBusinessInfo
    builder.addCase(addBusinessInfo.pending, (state) => {
      state.updatingInfo = true;
      state.updateInfoError = null;
      state.infoUpdated = false;
    });
    builder.addCase(addBusinessInfo.fulfilled, (state) => {
      state.updatingInfo = false;
      state.infoUpdated = true;
    });
    builder.addCase(addBusinessInfo.rejected, (state, action) => {
      state.updatingInfo = false;
      state.updateInfoError = action.payload as string;
    });
  },
});

export const { resetBusinessOnboardingState } = businessOnboardingSlice.actions;

export default businessOnboardingSlice.reducer;