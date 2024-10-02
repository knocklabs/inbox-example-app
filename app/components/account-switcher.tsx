"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AccountSwitcherProps {
  isCollapsed: boolean;
  accounts: {
    id: string;
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
}

export function AccountSwitcher({
  isCollapsed,
  accounts,
}: AccountSwitcherProps) {
  const currentAccount =
    accounts.find(
      (account) => account.id === process.env.NEXT_PUBLIC_KNOCK_USER_ID
    ) || accounts[0];

  return (
    <div
      className={cn("flex items-center gap-2", isCollapsed && "justify-center")}
    >
      {currentAccount.icon}
      <span className={cn("ml-2", isCollapsed && "hidden")}>
        {currentAccount.label}
      </span>
    </div>
  );
}

// ... existing code ...
