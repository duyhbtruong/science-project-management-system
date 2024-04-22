"use client";

import { Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const items = [
  { label: <Link href="/admin/dashboard">Dashboard</Link>, key: "dashboard" },
  {
    label: <Link href="/admin/accounts">Quản lý tài khoản</Link>,
    key: "accounts",
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
      <div className="">
        <Menu
          onClick={(e) => setCurrent(e.key)}
          mode="horizontal"
          selectedKeys={[current]}
          items={items}
        />
      </div>
    </>
  );
};

export default NavigationBar;
