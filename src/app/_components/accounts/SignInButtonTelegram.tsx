"use client";

import { signIn, useSession } from "next-auth/react";
import { LoginButton } from "@telegram-auth/react";

export function SignInButtonTelegram() {
  const { data: session } = useSession();

  return (
    <LoginButton
      botUsername={"tonquest_official_bot"}
      onAuthCallback={(data) => {
        void signIn("telegram-login", {
          callbackUrl: "/profile",
          telegramData: data,
          currentUser: session?.user ? JSON.stringify(session?.user) : null,
        });
      }}
    />
    // <Button
    //   onClick={tonConnectModal.open}
    //   color="primary"
    //   className="font-bold sm:text-xs"
    //   isLoading={isConnectionRestored && Boolean(wallet)}
    // >
    //   Connect TON wallet
    // </Button>
  );
}
