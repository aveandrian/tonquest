"use client";
import { Button } from "@nextui-org/react";
import {
  useIsConnectionRestored,
  useTonConnectModal,
  useTonWallet,
} from "@tonconnect/ui-react";

export function SignInButtonTON() {
  const tonConnectModal = useTonConnectModal();
  const isConnectionRestored = useIsConnectionRestored();
  const wallet = useTonWallet();

  return (
    <Button
      onClick={tonConnectModal.open}
      color="primary"
      className="font-bold sm:text-xs"
      isLoading={isConnectionRestored && Boolean(wallet)}
    >
      Connect TON wallet
    </Button>
  );
}
