"use client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Link,
} from "@nextui-org/react";
import SignOutButton from "./sign-out-button";

export default function NavbarProfile() {
  return (
    <Dropdown className="bg-background">
      <DropdownTrigger>
        <Button color="primary" className="text-blue">
          MENU
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Static Actions"
        itemClasses={{
          base: [
            "data-[hover=true]:bg-[#FAA968]",
            "data-[hover=true]:bg-opacity-50",
          ],
        }}
      >
        <DropdownItem key="profile">
          <Button
            href="/profile"
            as={Link}
            color="primary"
            variant="solid"
            fullWidth={true}
            className="uppercase text-blue"
          >
            Profile
          </Button>
        </DropdownItem>
        <DropdownItem key="signout" className="sm:hidden">
          <SignOutButton />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
