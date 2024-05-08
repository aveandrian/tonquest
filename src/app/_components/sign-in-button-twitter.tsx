"use client";

import { signIn } from "next-auth/react";
import { Button } from "flowbite-react";

export default function SingInButtonTwitter() {

  return (
      <Button onClick={() => signIn("twitter", { callbackUrl: '/profile'})}>Connect Twitter</Button>
  )
}
