"use client";

import { signIn, useSession } from "next-auth/react";
import { Button } from "@nextui-org/react";
import { type TelegramUserData } from "@telegram-auth/server";
import { useState } from "react";
import { toast } from "sonner";

declare global {
  interface Window {
    Telegram: {
      Login: {
        auth: (
          params: Record<string, string | boolean>,
          cb: (data: TelegramUserData) => Promise<void>,
        ) => void;
      };
    };
  }
}

export function SignInButtonTelegram() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setIsLoading(true);
    window.Telegram.Login.auth(
      { bot_id: "6488814034", request_access: true },
      async (data) => {
        if (!data) {
          // authorization failed
          setIsLoading(false);
          return;
        }
        try {
          // Here you would want to validate data like described there https://core.telegram.org/widgets/login#checking-authorization
          await signIn("telegram-login", {
            callbackUrl: "/profile",
            telegramData: JSON.stringify(data),
            currentUser: session?.user ? JSON.stringify(session?.user) : null,
          });
          toast.success("Logged in successfully");
        } catch (e) {
          toast.error("Something went wrong");
        } finally {
          setIsLoading(false);
        }
      },
    );
  };

  return (
    <Button
      color="primary"
      className="font-bold text-blue"
      onClick={handleLogin}
      isLoading={isLoading}
      disabled={isLoading}
    >
      Login with Telegram
    </Button>
  );
}
