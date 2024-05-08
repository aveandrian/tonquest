"use client";

import { type ReactNode } from "react";
import { WagmiProvider } from "wagmi";

import { config } from "@/wagmi";

import { TonConnectUIProvider } from "@tonconnect/ui-react";

import { TonBackendAuthProvider } from "./TonBackendAuth";
export function Providers(props: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <TonConnectUIProvider manifestUrl="https://ton-achievements.vercel.app/tonconnect-manifest.json">
        {/* <TonBackendAuthProvider> */}

        {props.children}

        {/* </TonBackendAuthProvider> */}
      </TonConnectUIProvider>
    </WagmiProvider>
  );
}
