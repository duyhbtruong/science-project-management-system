"use client";

import { Layout } from "antd";
import NavigationBar from "./nav-bar";
const { Content, Sider } = Layout;

export default function AdminLayout({ children }) {
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
