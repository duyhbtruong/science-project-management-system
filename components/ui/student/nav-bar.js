"use client";

import { logout } from "@/app/(pages)/auth/login/page";
import { Button, Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogOut } from "@/components/ui/icon/logout";

const items = [
  {
    label: <span className="text-lg font-semibold">UIT - RPMS</span>,
    key: "logo",
    disabled: true,
  },
  { label: <Link href="/student/dashboard">Dashboard</Link>, key: "dashboard" },
  {
    label: <Link href="/student/topics">Đăng ký đề tài</Link>,
    key: "topics",
  },
  {
    label: "Hồ sơ",
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
    if (pathname.includes("dashboard")) return "dashboard";
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
