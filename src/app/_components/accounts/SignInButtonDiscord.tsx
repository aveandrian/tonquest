"use client";

import { signIn } from "next-auth/react";
import { Button } from "@nextui-org/react";

export function SignInButtonDiscord() {
  return (
    <Button
      onClick={() => signIn("discord", { callbackUrl: "/profile" })}
      color="primary"
      className="font-bold text-blue"
    >
      Connect Discord
    </Button>
  );
}
