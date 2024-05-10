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
  const { data: session } = useSession();

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

    if (session) {
      console.log("set token!");
      // setToken(token);
      return;
    }

    if (
      wallet.connectItems?.tonProof &&
      !("error" in wallet.connectItems.tonProof)
    ) {
      console.log("CHECK PROOF");

      void signIn("ton", {
        walletInfo: JSON.stringify(wallet),
      });

      localStorage.setItem(localStorageKey, "verified");
    } else {
      void tonConnectUI.disconnect();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, isConnectionRestored]);
}
