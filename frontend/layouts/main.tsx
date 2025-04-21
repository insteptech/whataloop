import { useRouter } from "next/router";
import React from "react";


type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  return (
    <div className="layout">
      <header>
        <h1>My Application</h1>
        <a onClick={()=>router.push("/auth/login")}>Login</a> <br/>
        <a onClick={()=>router.push("/auth/main")}>main</a> <br/>
        <a onClick={()=>router.push("/")}>home</a> <br/>
        <a onClick={()=>router.push("/dashboard")}>dashboard</a> <br/>
      </header>
      <main>{children}</main>
      <footer>
        <p>© 2024 My Application</p>
      </footer>
    </div>
  );
}

export default Layout;