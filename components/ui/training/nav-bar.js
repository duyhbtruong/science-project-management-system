"use client";

import { logout } from "@/app/(pages)/auth/login/page";
import { Button, Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoutOutlined } from "@ant-design/icons";

const items = [
  { label: <AppLogo fontSize={`text-2xl`} />, key: "logo" },
  {
    label: <Link href="/training/topics">Quản lý đồ án</Link>,
    key: "topics",
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
    if (pathname.includes("topics")) return "topics";
  });

  return (
    <>
      <Menu
        className="px-32 h-[56px] items-center"
        onClick={(e) => setCurrent(e.key)}
        mode="horizontal"
        selectedKeys={[current]}
        items={items}
      />
    </>
  );
};

export default NavigationBar;
