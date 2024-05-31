"use client";

import { type ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";

import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { mainnet, sepolia } from "wagmi/chains";

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

export function Providers(props: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <TonConnectUIProvider
        manifestUrl="https://tonquest.vercel.app/tonconnect-manifest.json"
        restoreConnection={true}
      >
        {props.children}
        <ProgressBar
          height="4px"
          color="#F85525"
          options={{ showSpinner: false }}
          shallowRouting
        />
      </TonConnectUIProvider>
    </WagmiProvider>
  );
}
