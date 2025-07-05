import { Avatar, Dropdown, Modal } from "antd";
import { UserIcon, LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { useCustomSession } from "@/hooks/use-custom-session";
import { useState } from "react";
import { getAccountById } from "@/service/accountService";
import { ProfileModal } from "./profile-modal";

export const Header = () => {
  const { session } = useCustomSession();

  const [profileModalData, setProfileModalData] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileModalLoading, setProfileModalLoading] = useState(false);

  const handleProfileModalOpen = () => {
    setProfileModalOpen(true);
    setProfileModalLoading(true);

    getAccountById(session?.user?.id).then(async (res) => {
      setProfileModalLoading(false);
      setProfileModalData(await res.json());
    });
  };

  const letter = session?.user?.name
    ? session?.user?.name.charAt(0).toUpperCase()
    : "?";

  const getColor = (str) => {
    const nameToNumber = str
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = Math.abs(nameToNumber) % 360;
    return `hsl(${hue}, 80%, 60%)`;
  };

  const items = [
    {
      key: "profile",
      label: "Hồ sơ",
      icon: <UserIcon className="size-4" />,
      onClick: handleProfileModalOpen,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogOutIcon className="size-4" />,
      onClick: () => signOut({ callbackUrl: "/auth/login" }),
    },
  ];

  return (
    <div className="flex justify-end items-center px-6 h-14 bg-white border-b">
      {session && (
        <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
          <div className="flex gap-3 items-center transition-opacity cursor-pointer">
            <Avatar
              size="default"
              style={{ backgroundColor: getColor(session?.user?.name) }}
            >
              {letter}
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{session?.user?.name}</span>
              <span className="text-xs text-gray-500">
                {session?.user?.email}
              </span>
            </div>
          </div>
        </Dropdown>
      )}
      <ProfileModal
        profileModalOpen={profileModalOpen}
        setProfileModalOpen={setProfileModalOpen}
        profileModalLoading={profileModalLoading}
        profileModalData={profileModalData}
      />
    </div>
  );
};
