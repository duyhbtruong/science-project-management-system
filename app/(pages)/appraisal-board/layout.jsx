"use client";

import NavigationBar from "@/app/(pages)/appraisal-board/nav-bar";
import { Layout } from "antd";
const { Content, Sider } = Layout;

export default function AppraiseLayout({ children }) {
  return (
    <Layout hasSider={true}>
      <Sider collapsible theme="light" className="h-screen">
        <NavigationBar />
      </Sider>
      <Layout className="h-screen overflow-y-auto">
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
}
