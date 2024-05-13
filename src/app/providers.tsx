"use client";

import { type ReactNode } from "react";
import { WagmiProvider } from "wagmi";

import { config } from "@/wagmi";

import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { TelegramProvider } from "./TelegramProvider";

export function Providers(props: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <TonConnectUIProvider manifestUrl="https://tonquest.vercel.app/tonconnect-manifest.json">
        <TelegramProvider>
          {props.children}
          <ProgressBar
            height="4px"
            color="#F85525"
            options={{ showSpinner: false }}
            shallowRouting
          />
        </TelegramProvider>
      </TonConnectUIProvider>
    </WagmiProvider>
  );
}
