"use client";

import { Layout } from "antd";
import NavigationBar from "./nav-bar";
import { Header } from "@/components/header";
const { Content, Sider } = Layout;

export default function AdminLayout({ children }) {
  return (
    <Layout hasSider={true}>
      <Sider collapsible theme="light" className="h-screen">
        <NavigationBar />
      </Sider>
      <Layout className="h-screen overflow-y-auto">
        <Header />
        <Content className="h-[calc(100vh-56px)] bg-gray-100">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
