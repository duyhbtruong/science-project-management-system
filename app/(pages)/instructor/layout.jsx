"use client";

import NavigationBar from "@/app/(pages)/instructor/nav-bar";
import { Layout } from "antd";
const { Content, Sider } = Layout;

export default function InstructorLayout({ children }) {
  return (
    <Layout hasSider>
      <Sider collapsible theme="light" className="h-screen">
        <NavigationBar />
      </Sider>
      <Layout className="h-screen overflow-y-auto">
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
}
