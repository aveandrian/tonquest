"use client";

import { signIn, useSession } from "next-auth/react";
import { LoginButton } from "@telegram-auth/react";

export function SignInButtonTelegram() {
  const { data: session } = useSession();

  return (
    <LoginButton
      botUsername={"tonquest_official_bot"}
      onAuthCallback={(data) => {
        console.log("auth callback", data);
        void signIn("telegram-login", {
          callbackUrl: "/profile",
          telegramData: JSON.stringify(data),
          currentUser: session?.user ? JSON.stringify(session?.user) : null,
        });
      }}
    />
  );
}
