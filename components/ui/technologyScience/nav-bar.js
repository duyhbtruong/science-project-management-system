"use client";

import { logout } from "@/app/(pages)/auth/login/page";
import { Button, Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FileTextOutlined,
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
    label: <Link href="/technologyScience/topics">Quản lý đề tài</Link>,
    key: "topics",
    icon: <UnorderedListOutlined />,
  },
  {
    label: (
      <Link href="/technologyScience/registration">Quản lý đợt đăng ký</Link>
    ),
    key: "registration",
    icon: <FileTextOutlined />,
  },
  {
    label: <Link href="/technologyScience/review">Kiểm duyệt đề tài</Link>,
    key: "review",
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
    if (pathname.includes("registration")) return "registration";
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
