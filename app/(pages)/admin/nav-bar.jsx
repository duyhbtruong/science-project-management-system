"use client";

import { useState } from "react";
import { AppLogo } from "@/components/logo";
import { logout } from "@/app/(pages)/auth/login/page";
import { usePathname } from "next/navigation";
import { Menu } from "antd";
import Link from "next/link";
import Image from "next/image";
import { LogOutIcon, UsersIcon } from "lucide-react";

const items = [
  {
    label: <AppLogo fontSize={`text-md`} />,
    key: "logo",
    disabled: true,
    className: "hover:cursor-default",
    icon: <Image src="/logo.svg" alt="logo" width={24} height={24} />,
  },
  {
    label: <Link href="/admin/accounts">Quản lý tài khoản</Link>,
    key: "accounts",
    icon: <UsersIcon className="size-4" />,
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
    if (pathname.includes("accounts")) return "accounts";
  });

  return (
    <Menu
      className="h-full"
      onClick={(e) => setCurrent(e.key)}
      mode="inline"
      selectedKeys={[current]}
      items={items}
    />
  );
};

export default NavigationBar;
