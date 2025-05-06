import authReducer from  "@/modules/auth/redux/slices/authSlice"; 
import permissionReducer from  "@/modules/category/redux/slices/permissionSlice"; 
import profileReducer from  "@/modules/userprofile/redux/slices/profileSlice"; 
import leadReducer from  "@/modules/leads/redux/slices/leadSlice"; 
import constantReducer from  "@/modules/constants/redux/slices/constantsSlice"; 
import usersReducer from  "@/modules/users/redux/slices/usersSlice"; 
import appReducer from  "@/redux/slices/appSlice"; 
export const reducers = {
authReducer,
permissionReducer,
profileReducer,
leadReducer,
constantReducer,
usersReducer,
appReducer,

};
