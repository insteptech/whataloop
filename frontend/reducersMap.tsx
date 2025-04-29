import authReducer from  "@/modules/auth/redux/slices/authSlice"; 
import permissionReducer from  "@/modules/category/redux/slices/permissionSlice"; 
import leadReducer from  "@/modules/leads/redux/slices/leadSlice"; 
import appReducer from  "@/redux/slices/appSlice"; 
export const reducers = {
authReducer,
permissionReducer,
leadReducer,
appReducer,

};
