"use client";

import NavigationBar from "@/app/(pages)/instructor/nav-bar";
import { Layout } from "antd";
import { Header } from "@/components/header";
const { Content, Sider } = Layout;

export default function InstructorLayout({ children }) {
  return (
    <Layout hasSider>
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
