"use client";

import { type ReactNode } from "react";
import { ConnectKitProvider } from "connectkit";

export function ConnectKitWeb3Provider(props: { children: ReactNode }) {
  return <ConnectKitProvider>{props.children}</ConnectKitProvider>;
}
