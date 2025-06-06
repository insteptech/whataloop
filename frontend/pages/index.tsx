import { FC, useState } from "react";
import dynamic from "next/dynamic";
import { componentsMap } from "@/componentsMap"; // Import the generated map
import LeftSidebar from "@/components/common/LeftSidebar";
import { Col, Container, Row } from "react-bootstrap";
import HeaderTopBar from "@/components/common/HeaderTopBar";
const Layout = dynamic(() => import("../layouts/main"));
const Default = dynamic(() => import("./default"));

type PageProps = {
  slug: string | string[]; // Slug can be a string or array (e.g., `/auth/login`)
};

export default function Page({ slug }: PageProps) {
  const [sideBarWidth, setSideBarWidth] = useState(false);
  const [profile, setProfile] = useState(false);

  const OpenProfileDropDown = () => {
    setProfile(!profile);
  };

  const slugArray = Array.isArray(slug)
    ? slug.filter(Boolean)
    : slug
      ? [slug]
      : [];
  let modulePath = slugArray[0] || "/";
  let subModulesPath = slugArray.slice(1).join("/") || "/";

  function findMatchingRoute(userRoute, modulePath) {
    if (modulePath === "/" && userRoute === "/") {
      return componentsMap["/"];
    }
    // Iterate over defined routes only if componentsMap[modulePath] exists
    if (componentsMap[modulePath]) {
      for (const [route, component] of Object.entries(
        componentsMap[modulePath]
      )) {
        // Replace dynamic parts ([slug], [businessUserIdSlug]) with regex to match any value
        const regex = new RegExp(`^${route.replace(/\[.*?\]/g, "[^/]+")}$`);
        // Check if the user-provided route matches the current route pattern
        if (regex.test(userRoute)) {
          return component; // Return the matched route's file/component
        }
      }
    }
    return null; // No match found
  }

  const componentPath = findMatchingRoute(subModulesPath, modulePath);

  if (!componentPath) {
    return (
      <Layout>
        <div>404 - Page Not Found</div>
      </Layout>
    );
  }

  const isToken = localStorage.getItem("auth_token");

  const Component = (componentPath || Default) as FC;

  return (
    <Layout>
      {isToken ? (
        <div className="bg-layer-main">
          <Row className="w-100">
            <Col
              md={2}
              lg={3}
              className={`left-sidebar-sticky ${sideBarWidth ? "siddebar-hide-width" : "siddebar-mobile-width"
                }`}
            >
              <LeftSidebar Width={sideBarWidth}
                toggleSidebar={() => setSideBarWidth(!sideBarWidth)} />
            </Col>
            <Col
              md={10}
              lg={9}
              className={` ${sideBarWidth
                ? "right-sidebar-width"
                : "right-sidebar-mobile-width"
                }`}
            >
              {" "}
              <div className="right-sidebar-container">
                <Row>
                  <Col md={12} className="header-top-bar-sticky">
                    <HeaderTopBar
                      profileOpen={profile}
                      toggleProfile={OpenProfileDropDown}

                    />
                  </Col>

                  <Col md={12}>
                    {" "}
                    <Component />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      ) : (
        <Component />
      )}
    </Layout>
  );
}
