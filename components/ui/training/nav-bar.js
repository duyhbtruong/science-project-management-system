"use client";

import { logout } from "@/app/(pages)/auth/login/page";
import { Button, Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogOut } from "@/components/ui/icon/logout";

const items = [
  { label: "UIT - RPMS", key: "logo", disabled: true },
  {
    label: <Link href="/training/dashboard">Dashboard</Link>,
    key: "dashboard",
  },
  {
    label: <Link href="/training/topics">Quản lý đồ án</Link>,
    key: "topics",
  },
  {
    label: <Link href="/training/accounts">Hồ sơ</Link>,
    key: "profile",
    children: [
      {
        label: "Đăng xuất",
        key: "logout",
        icon: <LogOut className="size-4" />,
        onClick: async () => await logout(),
      },
    ],
  },
];

const NavigationBar = () => {
  const pathname = usePathname();
  const [current, setCurrent] = useState(() => {
    if (pathname.includes("accounts")) return "accounts";
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
