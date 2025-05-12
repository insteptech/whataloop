import Image from "next/image";
import Link from "next/link";
import React from "react";
// import Logo from "../../public/whataLoop-logo.svg";
import { HomeIcon, ProfileIcon, Logo, SubscriptionIcon } from "./Icon";
import { usePathname } from "next/navigation";

function LeftSidebar({ Width }: any) {
  const pathname = usePathname();

  console.log("Width::", Width);

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
    {
      href: "/subscription/containers",
      label: "Subscription",
      icon: <SubscriptionIcon />,
    },
    {
      href: "/users/usersList",
      label: "Users",
      icon: "",
    },
    {
      href: "constants/constantsList",
      label: "Constants",
      icon: "",
    },
  ];

  return (
    <div className="left-sidebar-container">
      <div className="side-bar-header">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <div className="side-bar-body">
        <ul>
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
      <div className="side-bar-footer">
        <div className="user-profile">
          <div className="avatar">U</div>
          <div className="user-info">
            <div className="name">User </div>
            <div className="role">Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSidebar;
