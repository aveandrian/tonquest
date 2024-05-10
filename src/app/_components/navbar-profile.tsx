"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import SingInButtonTON from "./sign-in-button-ton";
import { useSession } from "next-auth/react";
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
  const session = useSession();
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">Open Menu</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="profile">
          <Button
            href="/profile"
            as={Link}
            color="primary"
            variant="solid"
            fullWidth={true}
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
