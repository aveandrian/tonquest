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
        <Button color="primary">MENU</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="profile">
          <Button
            href="/profile"
            as={Link}
            color="primary"
            variant="solid"
            fullWidth={true}
            className="uppercase"
          >
            Profile
          </Button>
        </DropdownItem>
        <DropdownItem key="signout">
          <SignOutButton />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
