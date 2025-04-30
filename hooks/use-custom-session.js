"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { authRoutes, publicRoutes } from "../routes";

/**
 * Gives you access to the logged in user's session data and lets you modify it.
 *
 * @returns Updated session
 */
export function useCustomSession() {
  const { data: lieSession, status, update } = useSession();
  const [truthSession, setUpdatedSession] = useState(null);

  const pathname = usePathname();

  useEffect(() => {
    update().then((s) => {
      setUpdatedSession(s);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const session =
    publicRoutes.includes(pathname) || authRoutes.includes(pathname)
      ? truthSession
      : lieSession;

  return { session, status, update };
}
