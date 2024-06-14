"use client";
import { useEffect } from "react";
import {
  useIsConnectionRestored,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { signIn, signOut, useSession } from "next-auth/react";

export function useBackendAuth() {
  const isConnectionRestored = useIsConnectionRestored();
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!isConnectionRestored) {
      return;
    }

    if (status === "loading") {
      return;
    }

    if (session && !wallet) {
      void signOut();
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

    if (wallet && session && status === "authenticated") {
      console.log("user logged in");
      // setToken(token);
      return;
    }

    if (
      wallet.connectItems?.tonProof &&
      !("error" in wallet.connectItems.tonProof)
    ) {
      const refferal = localStorage.getItem("ref");
      void signIn("ton", {
        walletInfo: JSON.stringify(wallet),
        refferedBy: refferal,
      });
    } else {
      void tonConnectUI.disconnect();
    }
  }, [wallet, isConnectionRestored, session, status, tonConnectUI]);
}
