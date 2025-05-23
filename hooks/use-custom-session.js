"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

/**
 * Gives you access to the logged in user's session data and lets you modify it.
 *
 * @returns Updated session
 */
export function useCustomSession() {
  const { data: session, status, update } = useSession();
  const [updatedSession, setUpdatedSession] = useState(null);

  useEffect(() => {
    update().then((s) => {
      setUpdatedSession(s);
    });
  }, []);

  return { session: updatedSession || session, status, update };
}
