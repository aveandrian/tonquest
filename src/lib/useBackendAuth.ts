"use client";
import { useEffect } from "react";
import {
  useIsConnectionRestored,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { signIn, useSession } from "next-auth/react";

const localStorageKey = "my-dapp-auth-token";

export function useBackendAuth() {
  const isConnectionRestored = useIsConnectionRestored();
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!isConnectionRestored) {
      return;
    }

    if (!wallet) {
      const refreshPayload = async () => {
        tonConnectUI.setConnectRequestParameters({ state: "loading" });

        const myTonProof = "my-payload"; //await backendAuth.generatePayload();
        if (!myTonProof) {
          tonConnectUI.setConnectRequestParameters(null);
        } else {
          tonConnectUI.setConnectRequestParameters({
            state: "ready",
            value: { tonProof: myTonProof },
          });
        }
      };

      void refreshPayload();
      return;
    }

    if (session && status === "authenticated") {
      console.log("user logged in");
      // setToken(token);
      return;
    }

    if (
      wallet.connectItems?.tonProof &&
      !("error" in wallet.connectItems.tonProof)
    ) {
      void signIn("ton", {
        walletInfo: JSON.stringify(wallet),
      });
    } else {
      void tonConnectUI.disconnect();
    }
  }, [wallet, isConnectionRestored, session, status, tonConnectUI]);
}
