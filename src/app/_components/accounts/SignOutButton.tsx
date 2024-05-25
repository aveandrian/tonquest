"use client";

import { signOut } from "next-auth/react";
import { Button } from "@nextui-org/react";
import { useAccount, useDisconnect } from "wagmi";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";

export function SignOutButton() {
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();

  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  const disconnectMetamask = () => {
    const timer = setTimeout(() => {
      disconnect();
    }, 100);

    return () => clearTimeout(timer);
  };

  const handleSignOut = () => {
    void signOut();
    if (isConnected) disconnectMetamask();
    if (wallet) void tonConnectUI.disconnect();
  };
  return (
    <Button
      fullWidth
      onClick={handleSignOut}
      className="bg-giantsOrange font-bold text-[#F0FFF0]"
    >
      SIGN OUT
    </Button>
  );
}
