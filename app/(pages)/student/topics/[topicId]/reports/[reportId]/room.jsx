"use client";

import { useParams } from "next/navigation";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { FullscreenLoader } from "@/components/fullscreen-loader";

export function Room({ children }) {
  const params = useParams();
  return (
    <LiveblocksProvider
      publicApiKey={
        "pk_dev_U7jWjQN6D1VsC-Ty3cE43k_DqVJmSHRzasuWycF8zeuzMY4HmVh9fUnihPhomSZA"
      }
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
