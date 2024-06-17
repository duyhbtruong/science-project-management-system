"use client";

import { logout } from "@/app/(pages)/auth/login/page";
import { AppLogo } from "@/components/logo";
import { LogoutOutlined } from "@ant-design/icons";
import { Button, Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const items = [
  {
    label: <AppLogo fontSize={`text-md`} className="w-[300px]" />,
    key: "logo",
    disabled: true,
    className: "hover:cursor-default",
  },
  {
    label: <Link href="/admin/accounts">Quản lý tài khoản</Link>,
    key: "accounts",
  },
  {
    label: "Hồ sơ",
    key: "profile",
    children: [
      {
        label: "Đăng xuất",
        key: "logout",
        icon: <LogoutOutlined />,
        onClick: async () => await logout(),
      },
    ],
  },
];

const NavigationBar = () => {
  const pathname = usePathname();
  const [current, setCurrent] = useState(() => {
    if (pathname.includes("accounts")) return "accounts";
  });

  return (
    <>
      <Menu
        className="px-32 items-center"
        onClick={(e) => setCurrent(e.key)}
        mode="horizontal"
        selectedKeys={[current]}
        items={items}
      />
    </>
  );
};

export default NavigationBar;
