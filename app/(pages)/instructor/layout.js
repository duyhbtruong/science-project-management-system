"use client";

import NavigationBar from "@/components/ui/instructor/nav-bar";
import { Layout } from "antd";
const { Header, Content, Footer, Sider } = Layout;

export default function InstructorLayout({ children }) {
  return (
    <Layout hasSider>
      <Sider theme="light" className="relative">
        <NavigationBar />
      </Sider>
      <Layout className="px-6">
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
}
