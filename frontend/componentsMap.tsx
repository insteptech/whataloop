import dynamic from 'next/dynamic'; export const componentsMap = {
  "auth": {
    "register": dynamic(() => import("@/modules/auth/containers/register/index"), { ssr: false, loading: () => <div>Loading...</div> }), 
    "main": dynamic(() => import("@/modules/auth/containers/login/main"), { ssr: false, loading: () => <div>Loading...</div> }), 
    "login": dynamic(() => import("@/modules/auth/containers/login/index"), { ssr: false, loading: () => <div>Loading...</div> }), 
  },
  "main": {
    "403": dynamic(() => import("@/containers/403"), { ssr: false, loading: () => <div>Loading...</div> }), 
    "dashboard": dynamic(() => import("@/containers/dashboard/index"), { ssr: false, loading: () => <div>Loading...</div> }), 
  },
};
