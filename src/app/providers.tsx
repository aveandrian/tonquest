"use client";

import { type ReactNode } from "react";
import { WagmiProvider } from "wagmi";

import { config } from "@/wagmi";

import { TonConnectUIProvider } from "@tonconnect/ui-react";

export function Providers(props: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <TonConnectUIProvider manifestUrl="https://twitter-clone-beta-beryl.vercel.app/tonconnect-manifest.json">
        {props.children}
      </TonConnectUIProvider>
    </WagmiProvider>
  );
}
