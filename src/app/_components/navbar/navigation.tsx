"use client";
import { SignInButtonTON } from "@/app/_components/accounts/SignInButtonTON";
import { useSession } from "next-auth/react";
import { NavbarProfile } from "@/app/_components/navbar/NavbarProfile";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Spinner,
} from "@nextui-org/react";

import { TonQuestLogo } from "@/app/_components/images/TonQuestLogo";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function Navigation() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  return (
    <Navbar position="static" className="text-blue">
      <NavbarContent>
        <NavbarBrand>
          <Link
            href="/"
            aria-current="page"
            color="foreground"
            className="flex items-center gap-1"
          >
            <TonQuestLogo />
            <p className="font-bold text-blue text-inherit">TONquest</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="gap-4 sm:hidden" justify="center">
        <NavbarItem>
          <Link
            href="/"
            className={`link ${pathname === "/" ? "underline decoration-double	underline-offset-2	" : ""} font-semibold `}
          >
            Explore
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="/score"
            className={`link ${pathname === "/score" ? "underline decoration-double	underline-offset-2	" : ""} font-semibold `}
          >
            Score
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="lg:flex">
          {status === "loading" && <Spinner />}
          {!session && status !== "loading" && <SignInButtonTON />}
          {!!session && <NavbarProfile />}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
