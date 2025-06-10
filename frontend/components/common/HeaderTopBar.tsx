import { FC, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  DownArrow,
  HamburgerMenuIcon,
  LogOutIcon,
  UserIcon,
  ViewProfileIcon,
} from "@/components/common/Icon";
import ChatModal from "@/components/common/ChatModal";
import { fetchProfile } from "@/modules/userprofile/redux/actions/profileAction";
import { logout } from "@/modules/auth/redux/slices/authSlice";

type Props = {
  profileOpen: boolean;
  toggleProfile: () => void;
};

const HeaderTopBar: FC<Props> = ({ profileOpen, toggleProfile }) => {
  const dispatch: any = useDispatch();
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);
  const [messageOpen, setMessageOpen] = useState(false);

  const { data: user } = useSelector(
    (state: {
      profileReducer: { data: any; loading: boolean; error: string };
    }) => state.profileReducer
  );

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token && !user?.fullName) {
      dispatch(fetchProfile(token));
    } else if (!token) {
      console.warn("No token found in localStorage");
    }
  }, [dispatch, user?.fullName]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileOpen &&
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        toggleProfile();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [profileOpen, toggleProfile]);

  const handleViewProfile = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    const result = await dispatch(fetchProfile(token));
    if (fetchProfile.fulfilled.match(result)) {
      toggleProfile();
      router.push("/userprofile/profile");
    } else {
      console.error("Failed to fetch profile:", result.payload);
    }
  };

  return (
    <header className="header-top-bar sticky top-0 z-50">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="header-top-bar-left d-flex align-items-center gap-3">
              {/* Optional Left Content */}
            </div>
          </div>

          <div className="col-md-6">
            <div className="header-top-bar-right d-flex align-items-center justify-content-end">

              <div className="user-profile dropdown" ref={profileRef}>
                <button
                  className="d-flex align-items-center bg-transparent border-0"
                  onClick={toggleProfile}
                >
                  {/* <div className="avatar me-2">
                    <UserIcon />
                  </div> */}
                  <span className="d-none d-md-inline text-dark fw-medium">
                    {user?.full_name || "User"}
                  </span>
                  <DownArrow />
                </button>

                <ul
                  className={`dropdown-menu dropdown-menu-end ${profileOpen ? "open-profile-menu" : ""
                    } z-50`}
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
                    <button
                      className="dropdown-item d-flex align-items-center"
                      onClick={() => {
                        router.push("/subscription/containers");
                        toggleProfile();
                      }}
                    >
                      Subscription
                    </button>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center text-danger"
                      onClick={() => {
                        router.push("/auth/login");
                        localStorage.removeItem("auth_token");
                        dispatch(logout());
                        toggleProfile();
                      }}
                    >
                      <LogOutIcon />
                      Logout
                    </button>
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