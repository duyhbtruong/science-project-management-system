"use client";

import { logout } from "@/app/(pages)/auth/login/page";
import { Button, Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogOut } from "@/components/ui/icon/logout";

const items = [
  { label: "UIT - RPMS", key: "logo", disabled: true },
  { label: <Link href="/admin/dashboard">Dashboard</Link>, key: "dashboard" },
  {
    label: <Link href="/admin/accounts">Quản lý tài khoản</Link>,
    key: "accounts",
  },
  {
    label: <Link href="/admin/accounts">Hồ sơ</Link>,
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
    if (pathname.includes("dashboard")) return "dashboard";
  });

  return (
    <>
      <Menu
        className="px-32"
        onClick={(e) => setCurrent(e.key)}
        mode="horizontal"
        selectedKeys={[current]}
        items={items}
      />
    </>
  );
};

export default NavigationBar;
