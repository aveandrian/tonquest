"use client";

import { signIn } from "next-auth/react";
export default function SingInButtons() {
  async function handleSignIn(type: string) {
    await signIn(type, { callbackUrl: '/profile'})
  }

  return (
    <>
        <button onClick={() => handleSignIn("twitter")}>SIGN IN WITH TWITTER</button>
        <button onClick={() => handleSignIn("discord")}>SIGN IN WITH DISCORD</button>
    </>
  )
}
