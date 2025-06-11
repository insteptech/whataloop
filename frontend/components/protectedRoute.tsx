// // components/ProtectedRoute.tsx
// import { useRouter } from "next/router";
// import { ReactNode, useEffect, useState } from "react";
// import { publicRoutes } from "../utils/routes";
// import { getDecodedToken, isAuthenticated } from "@/utils/auth";
// import { useDispatch, useSelector } from "react-redux";
// import { getUserDetail } from "@/redux/actions/mainAction";

// type ProtectedRouteProps = {
//   children: ReactNode;
// };

// const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
//   const router = useRouter();

//   const dispatch = useDispatch<any>();
//   const userPermissions = useSelector(
//     (state: any) => state.appReducer.userPermissions
//   );

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!router.isReady) return;
//     // if (typeof window !== "undefined") {
//     //   const currentPath = window.location.pathname;

//     //   if (publicRoutes.includes(currentPath) && isAuthenticated()) {
//     //     router.push("/dashboard/containers");
//     //     return;
//     //   }
//     // }

//     const fullPath = router.asPath.split("?")[0];
//     const normalized = fullPath.replace(/^\/|\/$/g, "").toLowerCase();  

//     if ((isAuthenticated() && userPermissions.length == 0)) {
//       const user: any = getDecodedToken();
//       dispatch(getUserDetail(user?.id));
//     } else if (normalized.includes("auth/register")) {
//         router.push("/auth/register");
//         return;
//     } else {
//         router.push("/auth/login");
//         return;
//     }
//   }, [router.isReady]);

//   const isRoutePermission = (): boolean => {
//     if (!userPermissions || userPermissions.length === 0) return false;

//     const path = window.location.pathname.replace(/^\/|\/$/g, "").toLowerCase();
//     const permission = userPermissions.find(
//       (item) =>
//         item.route.replace(/^\/|\/$/g, "").toLowerCase() === path &&
//         item.type === "frontend"
//     );

//     return !!permission;
//     // return true;
//   };

//   useEffect(() => {
//     const handleRouteProtection = async () => {
//       if (typeof window !== "undefined") {
//         const currentPath = window.location.pathname;

//         if (publicRoutes.includes(currentPath)) {
//           setLoading(false);
//           return;
//         }

//         if (!isAuthenticated()) {
//           router.push("/auth/login");
//           return;
//         }
//         else {
//           router.push('/dashboard/containers')
//         }

//         // if (userPermissions && userPermissions.length > 0) {
//         //   if (!isRoutePermission()) {
//         //     if (
//         //       window.location.pathname.replace(/^\/|\/$/g, "").toLowerCase() !=
//         //       "/403".replace(/^\/|\/$/g, "").toLowerCase()
//         //     )
//         //       router.push("/403");
//         //   }
//         //   setLoading(false);
//         // }
//       }
//     };

//     handleRouteProtection();
//   }, [router, userPermissions]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;


import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { publicRoutes } from "@/utils/routes";
import { getDecodedToken, isAuthenticated } from "@/utils/auth";
import { getUserDetail } from "@/redux/actions/mainAction";

interface Props {
  children: ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const userPermissions = useSelector(
    (state: any) => state.appReducer.userPermissions
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return; // wait until asPath & query are hydrated

    // 1️⃣ Build the “real” path
    let fullPath: string;
    if (router.pathname === "/[...slug]") {
      const slug = router.query.slug;
      fullPath = Array.isArray(slug)
        ? `/${slug.join("/")}`
        : typeof slug === "string"
        ? `/${slug}`
        : "/";
    } else {
      fullPath = router.asPath.split("?")[0];
    }

    if (
      isAuthenticated() &&
      ["/auth/login", "/auth/register"].includes(fullPath)
    ) {
      router.replace("/dashboard/containers");
      return;
    }

    if (publicRoutes.includes(fullPath)) {
      setLoading(false);
      return;
    }

    if (!isAuthenticated()) {
      router.replace("/auth/login");
      return;
    }

    if (userPermissions.length === 0) {
      const decoded = getDecodedToken();
      const userId = (decoded?.sub ?? (decoded as any)?.id) as string;
      if (userId) dispatch(getUserDetail(userId));
      return;
    }

    const normalized = fullPath.replace(/^\/|\/$/g, "").toLowerCase();
    const hasPerm = userPermissions.some((p: any) =>
      p.type === "frontend" &&
      p.route.replace(/^\/|\/$/g, "").toLowerCase() === normalized
    );
    // if (!hasPerm) {
    //   router.replace("/403");
    //   return;
    // }

    setLoading(false);

  }, [
    router.isReady,
    router.asPath,
    router.pathname,
    router.query.slug,
    userPermissions,
  ]);

  if (loading) return <div>Loading…</div>;
  return <>{children}</>;
};

export default ProtectedRoute;
