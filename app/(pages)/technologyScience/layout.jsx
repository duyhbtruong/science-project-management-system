"use client";

import NavigationBar from "@/app/(pages)/technologyScience/nav-bar";
import { Layout, message } from "antd";
const { Content, Sider } = Layout;

export default function TechnologyScienceLayout({ children }) {
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
