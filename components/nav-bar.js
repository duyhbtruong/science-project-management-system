"use client";

import { Button, Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
      <div className="flex flex-row justify-between">
        <Menu
          onClick={(e) => setCurrent(e.key)}
          mode="horizontal"
          selectedKeys={[current]}
          items={items}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
      </div>
    </>
  );
};

export default NavigationBar;
