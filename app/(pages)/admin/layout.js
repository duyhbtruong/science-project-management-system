"use client";

import NavigationBar from "@/components/ui/admin/nav-bar";
import { Layout } from "antd";
const { Header, Content, Footer, Sider } = Layout;

const siderStyle = {
  overflow: "auto",
  height: "100vh",
  position: "fixed",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
};

export default function AdminLayout({ children }) {
  return (
    <>
      <NavigationBar />
      {children}
    </>
  );
}
