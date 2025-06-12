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
        if (!res?.data?.url) {
          throw new Error("Stripe session URL not returned");
        } else {
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
const downloadStripeInvoice = createAsyncThunk<
  { sessionId: string; blob: Blob },
  string,
  { rejectValue: string }
>(
  "stripePayment/fetchStripeInvoice",
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `stripe/download?session_id=${sessionId}`,
        { responseType: "blob" }
      );
      if(response.status === 200){
        window.location.reload();
      }
      return { sessionId, blob: response.data as Blob };
    } catch (err: any) {
      const msg =
        err.response?.data?.message ?? err.message ?? "Download failed";
      return rejectWithValue(msg);
    }
  }
);

export { fetchStripePaymentUrl, downloadStripeInvoice };

