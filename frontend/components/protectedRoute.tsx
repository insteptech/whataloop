// components/ProtectedRoute.tsx
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { publicRoutes } from "../utils/routes";
import { getDecodedToken, isAuthenticated } from "@/utils/auth";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetail } from "@/redux/actions/mainAction";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();

  const dispatch = useDispatch<any>();
  const userPermissions = useSelector(
    (state: any) => state.appReducer.userPermissions
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated() && userPermissions.length==0) {
      const user: any = getDecodedToken()
      dispatch(getUserDetail(user.id));
    }
  }, []);

 
  const isRoutePermission = (): boolean => {
    if (!userPermissions || userPermissions.length === 0) return false;

    const path = window.location.pathname.replace(/^\/|\/$/g, "").toLowerCase();
    const permission = userPermissions.find(
      (item) =>
        item.route.replace(/^\/|\/$/g, "").toLowerCase() === path &&
        item.type === "frontend"
    );

    return !!permission;
  };

  useEffect(() => {
    const handleRouteProtection = async () => {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;

        if (publicRoutes.includes(currentPath)) {
          setLoading(false);  
          return;
        }

        if (!isAuthenticated()) {
          router.push("/");  
          return;
        }

        if (userPermissions && userPermissions.length > 0) {
          if (!isRoutePermission()) {
            if(window.location.pathname.replace(/^\/|\/$/g, "").toLowerCase()!="/403".replace(/^\/|\/$/g, "").toLowerCase())
            router.push("/403");
          }
          setLoading(false);
        }
      }
    };

    handleRouteProtection();
  }, [router, userPermissions]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
