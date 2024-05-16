"use client";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useAccount, useChainId, useConnect, useSignMessage } from "wagmi";
import { injected } from "wagmi/connectors";
import { useEffect } from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next-nprogress-bar";

export default function SingInButtonEVM() {
  const { signMessageAsync } = useSignMessage();
  const chainId = useChainId();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
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
    <Button
      color="primary"
      className="text-blue"
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        if (!isConnected) {
          connect({ connector: injected() });
        } else {
          void handleLogin();
        }
      }}
    >
      {isConnected ? "Sign a message" : "Connect EVM Wallet"}
    </Button>
  );
}
