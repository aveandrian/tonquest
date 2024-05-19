"use client";

import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

export function ContextSessionProvider(props: {
  children: React.ReactNode;
  serverSession: Session | null;
}) {
  return (
    <SessionProvider session={props.serverSession}>
      {props.children}
    </SessionProvider>
  );
}
