"use client";

import NavigationBar from "@/components/ui/admin/nav-bar";
import { Layout } from "antd";
const { Header, Content, Footer, Sider } = Layout;

export default function AdminLayout({ children }) {
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
