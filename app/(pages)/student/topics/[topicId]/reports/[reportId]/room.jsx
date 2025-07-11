"use client";

import { useParams, useRouter } from "next/navigation";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { getAccounts } from "@/service/accountService";
import { useEffect, useMemo, useState } from "react";
import { App } from "antd";

export function Room({ children }) {
  const params = useParams();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const { message } = App.useApp();

  const fetchUsers = useMemo(
    () => async () => {
      try {
        const res = await getAccounts();
        setUsers(await res.json());
      } catch (error) {
        console.log("Error: ", error);
      }
    },
    []
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <LiveblocksProvider
      authEndpoint={async () => {
        const endpoint = "/api/liveblocks-auth";
        const room = params.reportId;

        const response = await fetch(endpoint, {
          method: "POST",
          body: JSON.stringify({ room }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            message.error("Bạn không có quyền truy cập vào phòng này");
            router.push("/student/topics");
            return null;
          } else if (response.status === 404) {
            message.error("Không tìm thấy báo cáo");
            router.push("/student/topics");
            return null;
          } else {
            message.error("Đã xảy ra lỗi khi kết nối đến phòng");
            router.push("/student/topics");
            return null;
          }
        }

        return await response.json();
      }}
      resolveUsers={({ userIds }) => {
        return userIds.map(
          (userId) => users.find((user) => user._id === userId) ?? undefined
        );
      }}
    >
      <RoomProvider id={params.reportId}>
        <ClientSideSuspense
          fallback={<FullscreenLoader label="Room loading..." />}
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
