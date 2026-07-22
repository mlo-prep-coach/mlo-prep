"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getProfile } from "@/lib/storage";

export default function UserAvatar() {
  const pathname = usePathname();
  const [firstName, setFirstName] = useState(null);

  useEffect(() => {
    // Re-reads on every route change (not just on mount) since this layout
    // persists across client-side navigation — onboarding saves the profile
    // after this component's first mount, so it must recheck on navigation.
    // localStorage only exists client-side; reading it post-mount avoids a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFirstName(getProfile()?.firstName ?? null);
  }, [pathname]);

  if (!firstName) return null;

  return (
    <span
      title={firstName}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-navy-800 text-sm font-bold text-white"
    >
      {firstName.charAt(0).toUpperCase()}
    </span>
  );
}
