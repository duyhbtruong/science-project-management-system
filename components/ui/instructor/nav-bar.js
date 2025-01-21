"use client";

import { logout } from "@/app/(pages)/auth/login/page";
import { Button, Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  EditOutlined,
  LogoutOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { AppLogo } from "@/components/logo";

const items = [
  {
    label: <AppLogo fontSize={`text-md`} className="w-[300px]" />,
    key: "logo",
    disabled: true,
    className: "hover:cursor-default",
  },
  {
    label: <Link href="/instructor/topics">Hướng dẫn đề tài</Link>,
    key: "topics",
    icon: <UnorderedListOutlined />,
  },
  {
    label: <Link href="/instructor/review">Kiểm duyệt đề tài</Link>,
    key: "review",
    icon: <EditOutlined />,
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
    if (pathname.includes("topics")) return "topics";
    if (pathname.includes("review")) return "review";
  });

  return (
    <>
      <Menu
        onClick={(e) => setCurrent(e.key)}
        selectedKeys={[current]}
        items={items}
      />
    </>
  );
};

export default NavigationBar;
