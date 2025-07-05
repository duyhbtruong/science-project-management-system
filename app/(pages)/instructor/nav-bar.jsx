"use client";

import { Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AppLogo } from "@/components/logo";
import Image from "next/image";
import { ClipboardCheckIcon, LightbulbIcon, LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";

const NavigationBar = () => {
  const pathname = usePathname();
  const [current, setCurrent] = useState(() => {
    if (pathname.includes("topics")) return "topics";
    if (pathname.includes("review")) return "review";
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
      label: <Link href="/instructor/topics">Hướng dẫn đề tài</Link>,
      key: "topics",
      icon: <LightbulbIcon className="size-4" />,
    },
    {
      label: <Link href="/instructor/review">Kiểm duyệt đề tài</Link>,
      key: "review",
      icon: <ClipboardCheckIcon className="size-4" />,
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
