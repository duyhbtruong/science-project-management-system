"use client";

import { logout } from "@/app/(pages)/auth/login/page";
import { AppLogo } from "@/components/logo";
import { LogoutOutlined, BarChartOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { TeamOutlined } from "@ant-design/icons";

const items = [
  {
    label: <AppLogo fontSize={`text-md`} />,
    key: "logo",
    disabled: true,
    className: "hover:cursor-default",
  },
  {
    label: <Link href="/admin/accounts">Quản lý tài khoản</Link>,
    key: "accounts",
    icon: <TeamOutlined />,
  },
  {
    label: "Đăng xuất",
    key: "logout",
    icon: <LogoutOutlined />,
    onClick: async () => await logout(),
  },
];

const NavigationBar = () => {
  const pathname = usePathname();
  const [current, setCurrent] = useState(() => {
    if (pathname.includes("accounts")) return "accounts";
  });

  return (
    <Menu
      onClick={(e) => setCurrent(e.key)}
      theme="dark"
      mode="inline"
      selectedKeys={[current]}
      items={items}
    />
  );
};

export default NavigationBar;
