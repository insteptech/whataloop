// modules/auth/redux/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { sendOtp, verifyOtp } from '../actions/authAction';

const initialState = {
  user: null,
  message:"",
  loading: false,
  token:"",
  error:""
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
       state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
       state.loading = false;
        state.user = action.payload.data;
        state.token = action.payload.token
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

 
export const authActions = authSlice.actions;
export default authSlice.reducer;

