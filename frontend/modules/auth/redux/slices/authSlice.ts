import { createSlice } from '@reduxjs/toolkit';
import { login, sendOtp,  verifyOtpAndRegisterAndLogin } from '../actions/authAction';

const initialState = {
  user: null,
  message: "",
  loading: false,
  token: "",
  error: "",
  role: "",
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
      state.role = "";
      state.token = ""; // clear token on logout
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setRole(state, action) {
      
      state.role = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyOtpAndRegisterAndLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOtpAndRegisterAndLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.token = action.payload.token;
      })
      .addCase(verifyOtpAndRegisterAndLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.data;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setUser, logout, setLoading, setRole } = authSlice.actions;
export default authSlice.reducer;
