"use client";

import { useState } from "react";
import { AppLogo } from "@/components/logo";
import { usePathname } from "next/navigation";
import { Menu } from "antd";
import Link from "next/link";
import Image from "next/image";
import { LogOutIcon, UsersIcon } from "lucide-react";
import { signOut } from "next-auth/react";

const NavigationBar = () => {
  const pathname = usePathname();
  const [current, setCurrent] = useState(() => {
    if (pathname.includes("accounts")) return "accounts";
  });

  const items = [
    {
      label: <AppLogo fontSize={`text-md`} />,
      key: "logo",
      disabled: true,
      className: "hover:cursor-default",
      icon: (
        <Image
          src="/logo.svg"
          alt="logo"
          width="0"
          height="0"
          className="w-[24px] h-auto"
        />
      ),
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
      onClick: () => {
        signOut({ callbackUrl: "/auth/login" });
      },
    },
  ];

  return (
    <Menu
      className="h-full"
      onClick={(e) => {
        if (e.key !== "logout") setCurrent(e.key);
      }}
      mode="inline"
      selectedKeys={[current]}
      items={items}
    />
  );
};

export default NavigationBar;
