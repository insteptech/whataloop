
import { FC, useEffect, useRef,useState } from "react";
import { useSelector } from "react-redux";  
import {
  DownArrow,
  HamburgerMenuIcon,
  LogOutIcon,
  MessageIcon,
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
  const profileRef = useRef<HTMLDivElement>(null);
  const { data: user } = useSelector(
    (state: { profileReducer: { data: any; loading: boolean; error: string } }) => state.profileReducer
  );


  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token && !user?.fullName) {
      dispatch(fetchProfile(token));
    } else if (!token) {
      console.warn('No token found in localStorage');
    }
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileOpen && profileRef.current && !profileRef.current.contains(event.target as Node)) {
        toggleProfile();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen, toggleProfile]);

  const [messageOpen, setMessageOpen] = useState(false);

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
                  onClick={toggleProfile}
                >
                  <div className="avatar me-2">
                    <UserIcon />
                  </div>
                  <span className="d-none d-md-inline text-dark fw-medium">
                    {user?.fullName || "User"}
                  </span>
                  <DownArrow />
                </button>

                <ul className={`dropdown-menu dropdown-menu-end ${profileOpen ? "open-profile-menu" : ""}`}>
                  <li>
                    <button className="dropdown-item d-flex align-items-center" onClick={handleViewProfile}>
                      <ViewProfileIcon />
                      Profile
                    </button>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center text-danger"
                      onClick={() => {
                        localStorage.removeItem("auth_token");
                        toggleProfile();
                        router.push("/auth/login");
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
