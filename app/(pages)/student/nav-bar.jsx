"use client";

import { Menu } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AppLogo } from "@/components/logo";
import Image from "next/image";
import { ClipboardPenIcon, Lightbulb, LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";

const NavigationBar = () => {
  const pathname = usePathname();
  const [current, setCurrent] = useState(() => {
    if (pathname.includes("register")) return "register";
    if (pathname.includes("topics")) return "topics";
  });

  const items = [
    {
      label: <AppLogo fontSize={`text-md`} className="w-[300px]" />,
      key: "logo",
      disabled: true,
      className: "hover:cursor-default",
      icon: <Image src="/logo.svg" alt="logo" width={24} height={24} />,
    },
    {
      label: <Link href="/student/register">Đăng ký đề tài</Link>,
      key: "register",
      icon: <ClipboardPenIcon className="size-4" />,
    },
    {
      label: <Link href="/student/topics">Quản lý đề tài</Link>,
      key: "topics",
      icon: <Lightbulb className="size-4" />,
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
