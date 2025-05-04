"use client";

import { logout } from "@/app/(pages)/auth/login/page";
import { Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AppLogo } from "@/components/logo";
import Image from "next/image";
import {
  CalendarIcon,
  ClipboardListIcon,
  FileText,
  LineChartIcon,
  LogOutIcon,
} from "lucide-react";

const items = [
  {
    label: <AppLogo fontSize={`text-md`} />,
    key: "logo",
    disabled: true,
    className: "hover:cursor-default",
    icon: <Image src="/logo.svg" alt="logo" width={24} height={24} />,
  },
  {
    label: <Link href="/technologyScience/topics">Quản lý đề tài</Link>,
    key: "topics",
    icon: <ClipboardListIcon className="size-4" />,
  },
  {
    label: <Link href="/technologyScience/registration">Quản lý đăng ký</Link>,
    key: "registration",
    icon: <CalendarIcon className="size-4" />,
  },
  {
    label: <Link href="/technologyScience/templates">Mẫu báo cáo</Link>,
    key: "templates",
    icon: <FileText className="size-4" />,
  },
  {
    label: <Link href="/technologyScience/dashboard">Thống kê đề tài</Link>,
    key: "dashboard",
    icon: <LineChartIcon className="size-4" />,
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
    if (pathname.includes("review")) return "review";
    if (pathname.includes("registration")) return "registration";
    if (pathname.includes("dashboard")) return "dashboard";
    if (pathname.includes("section")) return "templates";
  });

  return (
    <>
      <Menu
        onClick={(e) => setCurrent(e.key)}
        mode="inline"
        selectedKeys={[current]}
        items={items}
      />
    </>
  );
};

export default NavigationBar;
