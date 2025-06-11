import dynamic from 'next/dynamic';
import Loader from '@/components/common/loader';

export const componentsMap = {
  "auth": {
    "register": dynamic(() => import("@/modules/auth/containers/register/index"), { ssr: false, loading: () => <Loader /> }), 
    "main": dynamic(() => import("@/modules/auth/containers/login/main"), { ssr: false, loading: () => <Loader /> }), 
    "login": dynamic(() => import("@/modules/auth/containers/login/index"), { ssr: false, loading: () => <Loader /> }), 
  },
  "userprofile": {
    "profile": dynamic(() => import("@/modules/userprofile/containers/profile/index"), { ssr: false, loading: () => <Loader /> }), 
  },
  "leads": {
    "leadsList": dynamic(() => import("@/modules/leads/containers/leadsList/index"), { ssr: false, loading: () => <Loader /> }), 
    "createLead": dynamic(() => import("@/modules/leads/containers/createLead/index"), { ssr: false, loading: () => <Loader /> }), 
  },
  "dashboard": {
    "containers": dynamic(() => import("@/modules/dashboard/containers/index"), { ssr: false, loading: () => <Loader /> }), 
    "UniqueVisitorChart": dynamic(() => import("@/modules/dashboard/containers/UniqueVisitorChart"), { ssr: false, loading: () => <Loader /> }), 
    "IncomeOverview": dynamic(() => import("@/modules/dashboard/containers/IncomeOverview"), { ssr: false, loading: () => <Loader /> }), 
    "AnalyticsReport": dynamic(() => import("@/modules/dashboard/containers/AnalyticsReport"), { ssr: false, loading: () => <Loader /> }), 
    "dashboard": dynamic(() => import("@/modules/dashboard/containers/dashboard/index"), { ssr: false, loading: () => <Loader /> }), 
  },
  "subscription": {
    "containers": dynamic(() => import("@/modules/subscription/containers/index"), { ssr: false, loading: () => <Loader /> }), 
    "checkout": dynamic(() => import("@/modules/subscription/containers/checkout/index"), { ssr: false, loading: () => <Loader /> }), 
  },
  "constants": {
    "constantsList": dynamic(() => import("@/modules/constants/containers/constantsList/index"), { ssr: false, loading: () => <Loader /> }), 
    "addConstants": dynamic(() => import("@/modules/constants/containers/addConstants/index"), { ssr: false, loading: () => <Loader /> }), 
  },
  "users": {
    "usersList": dynamic(() => import("@/modules/users/containers/usersList/index"), { ssr: false, loading: () => <Loader /> }), 
    "createUser": dynamic(() => import("@/modules/users/containers/createUser/index"), { ssr: false, loading: () => <Loader /> }), 
  },
  "messages": {
    "messagesAndReplies": dynamic(() => import("@/modules/messages/containers/messagesAndReplies/index"), { ssr: false, loading: () => <Loader /> }), 
  },
  "autoreplies": {
    "autoReplies": dynamic(() => import("@/modules/autoreplies/containers/autoReplies/index"), { ssr: false, loading: () => <Loader /> }), 
  },
  "stripepaymentstatus": {
    "unsuccessfull": dynamic(() => import("@/modules/stripepaymentstatus/containers/unsuccessfull/index"), { ssr: false, loading: () => <Loader /> }), 
    "successfull": dynamic(() => import("@/modules/stripepaymentstatus/containers/successfull/index"), { ssr: false, loading: () => <Loader /> }), 
  },
  "main": {
    "403": dynamic(() => import("@/containers/403"), { ssr: false, loading: () => <Loader /> }), 
    "dashboard": dynamic(() => import("@/containers/dashboard/index"), { ssr: false, loading: () => <Loader /> }), 
  },
  "/": dynamic(() => import("@/modules/auth/containers/login/index"), { ssr: false, loading: () => <Loader /> }), 
};
