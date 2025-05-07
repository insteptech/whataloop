import dynamic from 'next/dynamic'; export const componentsMap = {
  "auth": {
    "register": dynamic(() => import("@/modules/auth/containers/register/index"), { ssr: false, loading: () => <div>Loading...</div> }), 
    "main": dynamic(() => import("@/modules/auth/containers/login/main"), { ssr: false, loading: () => <div>Loading...</div> }), 
    "login": dynamic(() => import("@/modules/auth/containers/login/index"), { ssr: false, loading: () => <div>Loading...</div> }), 
  },
  "userprofile": {
    "profile": dynamic(() => import("@/modules/userprofile/containers/profile/index"), { ssr: false, loading: () => <div>Loading...</div> }), 
  },
  "leads": {
    "leadsList": dynamic(() => import("@/modules/leads/containers/leadsList/index"), { ssr: false, loading: () => <div>Loading...</div> }), 
    "createLead": dynamic(() => import("@/modules/leads/containers/createLead/index"), { ssr: false, loading: () => <div>Loading...</div> }), 
  },
  "dashboard": {
    "UniqueVisitorChart": dynamic(() => import("@/modules/dashboard/containers/UniqueVisitorChart"), { ssr: false, loading: () => <div>Loading...</div> }), 
    "containers": dynamic(() => import("@/modules/dashboard/containers/index"), { ssr: false, loading: () => <div>Loading...</div> }), 
    "IncomeOverview": dynamic(() => import("@/modules/dashboard/containers/IncomeOverview"), { ssr: false, loading: () => <div>Loading...</div> }), 
    "AnalyticsReport": dynamic(() => import("@/modules/dashboard/containers/AnalyticsReport"), { ssr: false, loading: () => <div>Loading...</div> }), 
    "dashboard": dynamic(() => import("@/modules/dashboard/containers/dashboard/index"), { ssr: false, loading: () => <div>Loading...</div> }), 
  },
  "subscription": {
    "containers": dynamic(() => import("@/modules/subscription/containers/index"), { ssr: false, loading: () => <div>Loading...</div> }), 
    "checkout": dynamic(() => import("@/modules/subscription/containers/checkout/index"), { ssr: false, loading: () => <div>Loading...</div> }), 
  },
  "constants": {
    "constantsList": dynamic(() => import("@/modules/constants/containers/constantsList/index"), { ssr: false, loading: () => <div>Loading...</div> }), 
    "addConstants": dynamic(() => import("@/modules/constants/containers/addConstants/index"), { ssr: false, loading: () => <div>Loading...</div> }), 
  },
  "users": {
    "usersList": dynamic(() => import("@/modules/users/containers/usersList/index"), { ssr: false, loading: () => <div>Loading...</div> }), 
  },
  "main": {
    "403": dynamic(() => import("@/containers/403"), { ssr: false, loading: () => <div>Loading...</div> }), 
    "dashboard": dynamic(() => import("@/containers/dashboard/index"), { ssr: false, loading: () => <div>Loading...</div> }), 
  },
    "/": dynamic(() => import("@/modules/auth/containers/login/index"), { ssr: false, loading: () => <div>Loading...</div> }), 
};
