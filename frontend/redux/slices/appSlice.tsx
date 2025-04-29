// modules/auth/redux/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { getUserDetail } from '../actions/mainAction';
import { defaultUserDetail, defaultUserPermissions } from '@/utils/default';

const initialState = {
  // userDetail: null,
  // userPermissions: []
  userDetail: defaultUserDetail,
  userPermissions: defaultUserPermissions
};

const appSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      // .addCase(getUserDetail.pending, (state) => {
      //     state.userDetail = true;
      // })
      .addCase(getUserDetail.fulfilled, (state, action) => {
        state.userPermissions = action.payload?.data;
        if (action.payload && action.payload.data && action.payload.data.roles) {
          const roles = action.payload.data.roles;
          const permissionsArray = roles.flatMap(role =>
            role.permissions.map(permission => ({
              name: permission.name,
              type: permission.type,
              route: permission.route,
              action: permission.action
            }))
          )
          state.userPermissions = permissionsArray;
        }
      })
      .addCase(getUserDetail.rejected, (state) => {
        state.userDetail = null;
      });
  },
});

 
export const appActions = appSlice.actions;
export default appSlice.reducer;

