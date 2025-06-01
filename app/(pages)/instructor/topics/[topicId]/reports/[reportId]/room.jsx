"use client";

import { useParams } from "next/navigation";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { getAccounts } from "@/service/accountService";
import { useEffect, useMemo, useState } from "react";

export function Room({ children }) {
  const params = useParams();

  const [users, setUsers] = useState([]);

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
