"use client";

import { type ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";

import {
  ActionConfiguration,
  TonConnectUIProvider,
} from "@tonconnect/ui-react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { mainnet, sepolia } from "wagmi/chains";
import { walletConnect, injected } from "wagmi/connectors";

const metadata = {
  name: "TONquest",
  description: "Embark on quests!",
  url: "https://tonquest.vercel.com",
  icons: ["https://tonquest.vercel.com/favicon.ico"],
};

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    walletConnect({
      projectId: "25d5282c04f566a3e951b9a222f351b8",
      metadata,
      showQrModal: false,
    }),
    injected(),
  ],
  ssr: true,
});

const returnAction: ActionConfiguration = {
  returnStrategy: "back",
};

export function Providers(props: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <TonConnectUIProvider
        manifestUrl="https://tonquest.vercel.app/tonconnect-manifest.json"
        restoreConnection={true}
        actionsConfiguration={returnAction}
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
