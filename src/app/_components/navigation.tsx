"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import SingInButtonTON from "./sign-in-button-ton";
import { useSession } from "next-auth/react";
import NavbarProfile from "./navbar-profile";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@nextui-org/react";

import TonQuestLogo from "@/app/_components/ton-quest-logo";

export default function Navigation() {
  const { data: session } = useSession();

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
          {!session && <SingInButtonTON />}
          {!!session && <NavbarProfile />}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
