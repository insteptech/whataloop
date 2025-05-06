import { createSlice } from "@reduxjs/toolkit";
import { postConstant, fetchConstants } from "../action/constantAction";

interface ConstantState {
  loading: boolean;
  success: boolean;
  error: string | null;
  data: any;
  constantsList: any[];
  total: number;
  totalPages: number;
}

const initialState: ConstantState = {
  loading: false,
  success: false,
  error: null,
  data: null,
  constantsList: [],
  total: 0,
  totalPages: 0
};

const constantSlice = createSlice({
  name: "constantsList",
  initialState,
  reducers: {
    resetConstantState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
      state.constantsList = [];
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postConstant.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(postConstant.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })
      .addCase(postConstant.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      })
      .addCase(fetchConstants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConstants.fulfilled, (state, action) => {
        state.loading = false;
        state.constantsList = action.payload.constantsList;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchConstants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetConstantState } = constantSlice.actions;
export default constantSlice.reducer;
