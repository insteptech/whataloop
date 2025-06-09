// src/modules/subscription/redux/actions/stripeAction.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/axios/axiosInterceptor"; // Make sure this path is correct

interface CheckoutSessionArgs {
  planId: string;
  businessId: string;
  userId: string;
  amount?: number;
  successUrl?: string;
  cancelUrl?: string;
}

const fetchStripePaymentUrl = createAsyncThunk(
  "stripePayment/fetchStripePaymentUrl",
  async (params: CheckoutSessionArgs, { rejectWithValue }) => {
    try {
      const origin = window.location.origin;
      const _successUrl = params.successUrl || `${origin}/billing/success`;
      const _cancelUrl = params.cancelUrl || `${origin}/billing/cancel`;

      const body = {
        planId: params.planId,
        businessId: params.businessId,
        userId: params.userId,
        successUrl: _successUrl,
        cancelUrl: _cancelUrl,
       
      };

      await api.post("/stripe/checkout-session", body).then((res) => {
        console.log("Stripe Checkout Session Response:", res);
        if (!res?.data?.url) {
          throw new Error("Stripe session URL not returned");
        } else {
          console.log("Redirecting to Stripe URL:", res.data.url);
          window.location.href = res.data.url;
          return res.data.url; 
        }
      });
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export { fetchStripePaymentUrl };