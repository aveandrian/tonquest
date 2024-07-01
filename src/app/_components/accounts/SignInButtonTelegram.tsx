"use client";

import { signIn, useSession } from "next-auth/react";
import { LoginButton } from "@telegram-auth/react";
import { Button } from "@nextui-org/react";

export function SignInButtonTelegram() {
  const { data: session } = useSession();

  const handleLogin = async () => {
    window.Telegram.Login.auth(
      { bot_id: "6488814034", request_access: true },
      async (data) => {
        if (!data) {
          // authorization failed
          return;
        }

        // Here you would want to validate data like described there https://core.telegram.org/widgets/login#checking-authorization
        await signIn("telegram-login", {
          callbackUrl: "/profile",
          telegramData: JSON.stringify(data),
          currentUser: session?.user ? JSON.stringify(session?.user) : null,
        });
      },
    );
  };

  return (
    <Button
      color="primary"
      className="font-bold text-blue"
      onClick={handleLogin}
    >
      Login with Telegram
    </Button>
    // <LoginButton
    //   widgetVersion={22}
    //   cornerRadius={5}
    //   showAvatar={false}
    //   botUsername={"tonquest_official_bot"}
    //   onAuthCallback={(data) => {
    //     void signIn("telegram-login", {
    //       callbackUrl: "/profile",
    //       telegramData: JSON.stringify(data),
    //       currentUser: session?.user ? JSON.stringify(session?.user) : null,
    //     });
    //   }}
    // />
  );
}
