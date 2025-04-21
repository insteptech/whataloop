// modules/auth/redux/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { signInCall } from '../actions/authAction';

const initialState = {
  user: null,
  loading: false,
  error:""
};

const permissionSlice = createSlice({
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
      .addCase(signInCall.pending, (state) => {
        state.loading = true;
      })
      .addCase(signInCall.fulfilled, (state, action) => {
       state.loading = false;
        state.user = action.payload;
      })
      .addCase(signInCall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

 
export const authActions = permissionSlice.actions;
export default permissionSlice.reducer;

