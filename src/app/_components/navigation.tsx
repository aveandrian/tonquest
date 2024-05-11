"use client";
import SingInButtonTON from "./sign-in-button-ton";
import { useSession } from "next-auth/react";
import NavbarProfile from "./navbar-profile";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Spinner,
} from "@nextui-org/react";

import TonQuestLogo from "@/app/_components/ton-quest-logo";

export default function Navigation() {
  const { data: session, status } = useSession();

  return (
    <Navbar position="static">
      <NavbarBrand>
        <Link href="/" aria-current="page" color="foreground">
          <TonQuestLogo />
          <p className="font-bold text-inherit">TONquest</p>
        </Link>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem className="lg:flex">
          {status === "loading" && <Spinner />}
          {!session && <SingInButtonTON />}
          {!!session && <NavbarProfile />}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
