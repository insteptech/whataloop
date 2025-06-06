import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setRole } from "@/modules/auth/redux/slices/authSlice";
import { getDecodedToken } from "@/utils/auth";

import { HomeIcon, ProfileIcon, Logo, SubscriptionIcon, HamburgerMenuIcon } from "./Icon";
import UsersIcon from "../../public/group.png";

function LeftSidebar({ Width, toggleSidebar }: any) {
  const pathname = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    const { role }: any = getDecodedToken();
    if (role) {
      dispatch(setRole(role));
    }
  }, [dispatch]);

  const role = useSelector((state: any) => state.authReducer.role);

  const navLinks = [
    {
      href: "/dashboard/containers",
      label: "Home",
      icon: <HomeIcon />,
    },
    {
      href: "/leads/leadsList",
      label: "Leads",
      icon: <ProfileIcon />,
    },
    // {
    //   href: "/subscription/containers",
    //   label: "Subscription",
    //   icon: <SubscriptionIcon />,
    // },
    ...(role === "admin"
      ? [
        {
          href: "/users/usersList",
          label: "Users",
          icon: <Image src={UsersIcon} alt="Users Icon" width={24} height={24} />,
        },
        {
          href: "constants/constantsList",
          label: "Constants",
          icon: "",
        },
      ]
      : []),
    // {
    //   href: "/messages/messagesAndReplies",
    //   label: "Messages",
    //   icon: "",
    // },
    // {
    //   href: "/autoreplies/autoReplies",
    //   label: "Auto Replies",
    //   icon: "",
    // },
  ];

  return (
    <div className="left-sidebar-container">
      <div className="side-bar-header">

        <Logo />

      </div>

      <div className="side-bar-body">
        <button
          onClick={toggleSidebar}
          className="set-side-bar-button"
          aria-label="Toggle sidebar"
        >
          <HamburgerMenuIcon />
        </button>
        <ul>
          <h5>Main</h5>
          {navLinks.map(({ href, label, icon }) => (
            <li key={href}>
              <Link href={href} className={pathname === href ? "active" : ""}>
                {icon}
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* <div className="side-bar-footer">
        <div className="user-profile">
          <div className="avatar">U</div>
          <div className="user-info">
            <div className="name">User</div>
            <div className="role">{role}</div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default LeftSidebar;
