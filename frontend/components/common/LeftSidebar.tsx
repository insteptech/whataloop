import Image from "next/image";
import Link from "next/link";
import React from "react";
// import Logo from "../../public/whataLoop-logo.svg";
import { HomeIcon, ProfileIcon, Logo } from "./Icon";

function LeftSidebar() {
  return (
    <div className="left-sidebar-container">
      <div className="side-bar-header">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <div className="side-bar-body">
        <ul>
          <li>
            <Link href="/home" className="active">
              <HomeIcon />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link href="/leads">
              <ProfileIcon />
              <span>Leads</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="side-bar-footer">
        <div className="user-profile">
          <div className="avatar">UV</div>
          <div className="user-info">
            <div className="name">Upkar Verma</div>
            <div className="role">Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSidebar;
