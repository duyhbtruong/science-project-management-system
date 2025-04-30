"use client";

import { logout } from "@/app/(pages)/auth/login/page";
import { Button, Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoutOutlined, FileAddOutlined } from "@ant-design/icons";
import { AppLogo } from "@/components/logo";
import Image from "next/image";
import { ClipboardPenIcon, LogOutIcon } from "lucide-react";

const items = [
  {
    label: <AppLogo fontSize={`text-md`} className="w-[300px]" />,
    key: "logo",
    disabled: true,
    className: "hover:cursor-default",
    icon: <Image src="/logo.svg" alt="logo" width={24} height={24} />,
  },
  {
    label: <Link href="/student/topics">Đăng ký đề tài</Link>,
    key: "topics",
    icon: <ClipboardPenIcon className="size-4" />,
  },
  {
    label: "Đăng xuất",
    key: "logout",
    icon: <LogOutIcon className="size-4" />,
    onClick: async () => await logout(),
  },
];

const NavigationBar = () => {
  const pathname = usePathname();
  const [current, setCurrent] = useState(() => {
    if (pathname.includes("topics")) return "topics";
  });

  return (
    <Menu
      onClick={(e) => setCurrent(e.key)}
      mode="inline"
      selectedKeys={[current]}
      items={items}
    />
  );
};

export default NavigationBar;
