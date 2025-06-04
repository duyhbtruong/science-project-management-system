"use client";

import NavigationBar from "@/app/(pages)/appraisal-board/nav-bar";
import { Layout } from "antd";
import { Header } from "@/components/header";
const { Content, Sider } = Layout;

export default function AppraiseLayout({ children }) {
  return (
    <Layout hasSider={true}>
      <Sider collapsible theme="light" className="h-screen">
        <NavigationBar />
      </Sider>
      <Layout>
        <Header />
        <Content className="h-[calc(100vh-56px)] bg-gray-100">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
