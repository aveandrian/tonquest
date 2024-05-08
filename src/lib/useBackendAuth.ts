"use client";
import { useEffect, useRef } from "react";
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
  const interval = useRef<ReturnType<typeof setInterval> | undefined>();
  const { data: session } = useSession();

  useEffect(() => {
    if (!isConnectionRestored) {
      return;
    }

    clearInterval(interval.current);

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

    const token = localStorage.getItem(localStorageKey);
    if (token) {
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
        currentUser: session?.user ? JSON.stringify(session?.user) : null,
      });
      // tonProof.mutate({ walletInfo: wallet})
      // void client.wallet.tonConnectProof({
      //     address: c as string,
      //     proof: wallet.connectItems?.tonProof as TonProofItemReplySuccess['proof'],
      // })

      localStorage.setItem(localStorageKey, "verified");

      // backendAuth.checkProof(wallet.connectItems.tonProof.proof, wallet.account).then(result => {
      //     if (result) {
      //         setToken(result);
      //         localStorage.setItem(localStorageKey, result);
      //     } else {
      //         alert('Please try another wallet');
      //         tonConnectUI.disconnect();
      //     }
      // })
    } else {
      alert("Please try another wallet");
      void tonConnectUI.disconnect();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, isConnectionRestored]);
}
