import Loader from './components/common/loader';
import dynamic from 'next/dynamic'; export const componentsMap = {
  "auth": {
    "register": dynamic(() => import("@/modules/auth/containers/register/index"), { ssr: false, loading: () => <div><Loader/></div> }), 
    "main": dynamic(() => import("@/modules/auth/containers/login/main"), { ssr: false, loading: () => <div><Loader/></div> }), 
    "login": dynamic(() => import("@/modules/auth/containers/login/index"), { ssr: false, loading: () => <div><Loader/></div> }), 
  },
  "userprofile": {
    "profile": dynamic(() => import("@/modules/userprofile/containers/profile/index"), { ssr: false, loading: () => <div><Loader/></div> }), 
  },
  "leads": {
    "leadsList": dynamic(() => import("@/modules/leads/containers/leadsList/index"), { ssr: false, loading: () => <div><Loader/></div> }), 
    "createLead": dynamic(() => import("@/modules/leads/containers/createLead/index"), { ssr: false, loading: () => <div><Loader/></div> }), 
  },
  "dashboard": {
    "UniqueVisitorChart": dynamic(() => import("@/modules/dashboard/containers/UniqueVisitorChart"), { ssr: false, loading: () => <div><Loader/></div> }), 
    "containers": dynamic(() => import("@/modules/dashboard/containers/index"), { ssr: false, loading: () => <div><Loader/></div> }), 
    "IncomeOverview": dynamic(() => import("@/modules/dashboard/containers/IncomeOverview"), { ssr: false, loading: () => <div><Loader/></div> }), 
    "AnalyticsReport": dynamic(() => import("@/modules/dashboard/containers/AnalyticsReport"), { ssr: false, loading: () => <div><Loader/></div> }), 
    "dashboard": dynamic(() => import("@/modules/dashboard/containers/dashboard/index"), { ssr: false, loading: () => <div><Loader/></div> }), 
  },
  "subscription": {
    "containers": dynamic(() => import("@/modules/subscription/containers/index"), { ssr: false, loading: () => <div><Loader/></div> }), 
    "checkout": dynamic(() => import("@/modules/subscription/containers/checkout/index"), { ssr: false, loading: () => <div><Loader/></div> }), 
  },
  "constants": {
    "constantsList": dynamic(() => import("@/modules/constants/containers/constantsList/index"), { ssr: false, loading: () => <div><Loader/></div> }), 
    "addConstants": dynamic(() => import("@/modules/constants/containers/addConstants/index"), { ssr: false, loading: () => <div><Loader/></div> }), 
  },
  "users": {
    "usersList": dynamic(() => import("@/modules/users/containers/usersList/index"), { ssr: false, loading: () => <div><Loader/></div> }), 
  },
  "main": {
    "403": dynamic(() => import("@/containers/403"), { ssr: false, loading: () => <div><Loader/></div> }), 
    "dashboard": dynamic(() => import("@/containers/dashboard/index"), { ssr: false, loading: () => <div><Loader/></div> }), 
  },
    "/": dynamic(() => import("@/modules/auth/containers/login/index"), { ssr: false, loading: () => <div><Loader/></div> }), 
};
