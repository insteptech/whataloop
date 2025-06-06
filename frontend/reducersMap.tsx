import authReducer from  "@/modules/auth/redux/slices/authSlice"; 
import permissionReducer from  "@/modules/category/redux/slices/permissionSlice"; 
import profileReducer from  "@/modules/userprofile/redux/slices/profileSlice"; 
import leadReducer from  "@/modules/leads/redux/slices/leadSlice"; 
import businessOnboardingReducer from  "@/modules/dashboard/redux/slices/businessOnboardingSlice"; 
import subscriptionReducer from  "@/modules/subscription/redux/slices/subscriptionSlice"; 
import constantReducer from  "@/modules/constants/redux/slices/constantsSlice"; 
import usersReducer from  "@/modules/users/redux/slices/usersSlice"; 
import stripeReducer from  "@/modules/stripepaymentstatus/redux/slices/stripeSlice"; 
import appReducer from  "@/redux/slices/appSlice"; 
export const reducers = {
authReducer,
permissionReducer,
profileReducer,
leadReducer,
businessOnboardingReducer,
subscriptionReducer,
constantReducer,
usersReducer,
stripeReducer,
appReducer,

};
