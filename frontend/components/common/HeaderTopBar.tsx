"use client";

import { FC, useState } from "react";
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
import { useDispatch } from "react-redux";
import { fetchProfile } from "@/modules/userprofile/redux/actions/profileAction";
import { useRouter } from "next/navigation";
import ChatModal from "@/components/common/ChatModal";

type Props = {
  profileOpen: boolean;
  toggleProfile: () => void;
  toggleSidebar: () => void;
};

const HeaderTopBar: FC<Props> = ({
  profileOpen,
  toggleProfile,
  toggleSidebar,
}) => {
  const dispatch: any = useDispatch();
  const router = useRouter();

  const [messageOpen, setMessageOpen] = useState(false);

  const handleViewProfile = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.warn("No token found in localStorage");
      return;
    }

    const result = await dispatch(fetchProfile(token));
    if (fetchProfile.fulfilled.match(result)) {
      console.log("Profile fetched:", result.payload);
      router.push("/userprofile/profile");
    } else {
      console.error("Failed to fetch profile:", result.payload);
    }
  };

  return (
    <header className="header-top-bar">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="header-top-bar-left d-flex align-items-center gap-3">
              <button
                onClick={toggleSidebar}
                className="set-side-bar-button bg-transparent border-0 me-3 p-0"
                aria-label="Toggle sidebar"
              >
                <HamburgerMenuIcon />
              </button>

              {/* <div className="search-bar position-relative flex-grow-1">
                <input
                  type="text"
                  placeholder="Search..."
                  className="form-control py-2 rounded-pill"
                />
                <SearchIcon />
              </div> */}
            </div>
          </div>

          <div className="col-md-6">
            <div className="header-top-bar-right d-flex align-items-center justify-content-end">
              <button
                className="msg-button bg-transparent border-0 position-relative me-3"
                onClick={() => setMessageOpen(true)}
              >
                <MessageIcon />
              </button>
              <ChatModal
                show={messageOpen}
                onClose={() => setMessageOpen(false)}
              />
              <div className="user-profile dropdown">
                <button
                  className="d-flex align-items-center bg-transparent border-0"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={toggleProfile}
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
                    profileOpen ? "open-profile-menu" : ""
                  }`}
                >
                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center"
                      onClick={handleViewProfile}
                    >
                      <ViewProfileIcon />
                      Profile
                    </button>
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

      {/* Chat Modal */}
      <ChatModal show={messageOpen} onClose={() => setMessageOpen(false)} />
    </header>
  );
};

export default HeaderTopBar;
