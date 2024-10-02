"use client";
import React from "react";
import { KnockProvider } from "@knocklabs/react";

interface InboxProviderProps {
  children: React.ReactNode;
}

export function InboxProvider({ children }: InboxProviderProps) {
  return (
    <KnockProvider
      apiKey={process.env.NEXT_PUBLIC_KNOCK_API_KEY || ""}
      userId={process.env.NEXT_PUBLIC_KNOCK_USER_ID || ""}
    >
      {children}
    </KnockProvider>
  );
}
