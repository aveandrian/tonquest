"use client";

import { signOut } from "next-auth/react";
import { Button } from "flowbite-react";
import { useAccount, useDisconnect } from "wagmi";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";

export default function SignOutButton() {
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();

  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  const handleSignOut = () => {
    void signOut();
    if (isConnected) disconnect();
    if (wallet) void tonConnectUI.disconnect();
  };
  return <Button onClick={handleSignOut}>SIGN OUT</Button>;
}
