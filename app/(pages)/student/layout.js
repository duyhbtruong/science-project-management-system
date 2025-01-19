"use client";

import NavigationBar from "@/components/ui/student/nav-bar";
import { Layout } from "antd";
const { Header, Content, Footer, Sider } = Layout;

export default function StudentLayout({ children }) {
  return (
    <Layout hasSider>
      <Sider
        theme="light"
        className=" overflow-auto h-[100vh] fixed top-0 bottom-0"
      >
        <NavigationBar />
      </Sider>
      <Layout className="px-6">
        <Content className="h-[100vh] overflow-auto">{children}</Content>
      </Layout>
    </Layout>
  );
}
