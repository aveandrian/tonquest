"use client";

import { signOut } from "next-auth/react";
import { Button } from "flowbite-react";


export default function SignOutButton() {

  return (
      <Button onClick={() => signOut()}>SIGN OUT</Button>
  )
}
