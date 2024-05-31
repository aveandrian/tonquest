"use client";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useAccount, useChainId, useSignMessage } from "wagmi";
import { useModal } from "connectkit";

import { useEffect } from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next-nprogress-bar";

export function SignInButtonEVM() {
  const { signMessageAsync } = useSignMessage();
  const chainId = useChainId();
  const { address, isConnected } = useAccount();
  const { setOpen } = useModal();
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: chainId,
        nonce: await getCsrfToken(),
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      await signIn("evm", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        currentUser: session?.user ? JSON.stringify(session?.user) : null,
      });
      router.refresh();
    } catch (error) {
      window.alert(error);
    }
  };

  useEffect(() => {
    async function checkIsConnected() {
      if (isConnected && !session) {
        await handleLogin();
      }
    }
    void checkIsConnected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  return (
    <>
      <Button
        color="primary"
        className="font-bold text-blue"
        onClick={(e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
          if (!isConnected) {
            setOpen(true);
          } else {
            void handleLogin();
          }
        }}
      >
        {isConnected ? "Sign a message" : "Connect EVM Wallet"}
      </Button>
    </>
  );
}
