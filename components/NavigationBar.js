"use client";

import { Menu } from "antd";
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
  const [current, setCurrent] = useState("dashboard");
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes("accounts")) setCurrent("accounts");
    if (pathname.includes("dashboard")) setCurrent("dashboard");
  }, []);

  return (
    <>
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
    </>
  );
};

export default NavigationBar;
