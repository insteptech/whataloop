// stripeSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { fetchStripePaymentUrl } from "@/modules/stripepaymentstatus/redux/actions/stripeAction";

interface StripeState {
  loading: boolean;
  error: string | null;
}

const initialState: StripeState = {
  loading: false,
  error: null,
};

const stripeSlice = createSlice({
  name: "stripe",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStripePaymentUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStripePaymentUrl.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchStripePaymentUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Unknown error";
      });
  },
});

export default stripeSlice.reducer;