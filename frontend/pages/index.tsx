import { FC, useState } from "react";
import dynamic from "next/dynamic";
import { componentsMap } from "@/componentsMap"; // Import the generated map
import LeftSidebar from "@/components/common/LeftSidebar";
import { Col, Container, Row } from "react-bootstrap";
import {
  DownArrow,
  HamburgerMenuIcon,
  LogOutIcon,
  MessageIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
  ViewProfileIcon,
} from "@/components/common/Icon";

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
        <Row className="w-100">
          <Col
            md={2}
            className={` padding-right-0 left-sidebar-sticky ${
              sideBarWidth ? "siddebar-hide-width" : ""
            }`}
          >
            <LeftSidebar Width={sideBarWidth} />
          </Col>
          <Col
            md={10}
            className={`padding-left-0  padding-right-0 ${
              sideBarWidth ? "right-sidebar-width" : ""
            }`}
          >
            {" "}
            <Row>
              <Col md={12}>
                <header className="header-top-bar">
                  <div className="container-fluid">
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <div className="header-top-bar-left d-flex align-items-center gap-3">
                          <button
                            onClick={() => setSideBarWidth(!sideBarWidth)}
                            className="set-side-bar-button bg-transparent border-0 me-3 p-0"
                            aria-label="Toggle sidebar"
                          >
                            <HamburgerMenuIcon />
                          </button>

                          <div className="search-bar position-relative flex-grow-1">
                            <input
                              type="text"
                              placeholder="Search..."
                              className="form-control py-2 rounded-pill"
                            />
                            <SearchIcon />
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="header-top-bar-right d-flex align-items-center justify-content-end ">
                          <button className="msg-button bg-transparent border-0 position-relative me-3">
                            <MessageIcon />
                            {/* <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                              3
                            </span> */}
                          </button>

                          <div className="user-profile dropdown">
                            <button
                              className="d-flex align-items-center bg-transparent border-0 "
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                              onClick={OpenProfileDropDown}
                            >
                              <div className="avatar me-2">
                                <UserIcon />
                              </div>
                              <span className="d-none d-md-inline text-dark fw-medium">
                                John Doe
                              </span>
                              <DownArrow />
                            </button>

                            <ul
                              className={`dropdown-menu dropdown-menu-end ${
                                profile ? "open-profile-menu" : ""
                              }`}
                            >
                              <li>
                                <a
                                  className="dropdown-item d-flex align-items-center"
                                  href="#"
                                >
                                  <ViewProfileIcon />
                                  Profile
                                </a>
                              </li>
                              <li>
                                <a
                                  className="dropdown-item d-flex align-items-center"
                                  href="#"
                                >
                                  <SettingsIcon />
                                  Settings
                                </a>
                              </li>
                              <li>
                                <hr className="dropdown-divider" />
                              </li>
                              <li>
                                <a
                                  className="dropdown-item d-flex align-items-center text-danger"
                                  href="#"
                                >
                                  <LogOutIcon />
                                  Logout
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </header>
              </Col>
              <Col md={12}>
                {" "}
                <Component />
              </Col>
            </Row>
          </Col>
        </Row>
      ) : (
        <Component />
      )}
    </Layout>
  );
}
