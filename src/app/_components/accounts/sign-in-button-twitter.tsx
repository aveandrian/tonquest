"use client";

import { signIn } from "next-auth/react";
import { Button } from "@nextui-org/react";

export default function SingInButtonTwitter() {
  return (
    <Button
      onClick={() => signIn("twitter", { callbackUrl: "/profile" })}
      color="primary"
      className="font-bold text-blue"
    >
      Connect Twitter
    </Button>
  );
}