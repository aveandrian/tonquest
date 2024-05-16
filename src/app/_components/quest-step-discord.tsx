"use client";

import { Button, Link } from "@nextui-org/react";
import { useSession } from "next-auth/react";

export function QuestStepDiscord({
  isFollowClicked,
  handleFollowClick,
}: {
  isFollowClicked: boolean;
  handleFollowClick: () => void;
}) {
  const { data: session } = useSession();
  return (
    <>
      {session?.user.discord && (
        <Button
          href="https://discord.gg/cdVjsFw4eh"
          as={Link}
          variant="solid"
          className={`${isFollowClicked ? "bg-success-200" : "bg-danger-200"} font-bold`}
          fullWidth={true}
          isExternal
          showAnchorIcon
          onClick={handleFollowClick}
        >
          Join Discord
        </Button>
      )}
      {!session?.user.discord && (
        <Button
          href="/profile"
          as={Link}
          variant="solid"
          className="to-blue-500 w-fit bg-gradient-to-l from-cyan-500 px-5 font-bold"
        >
          Connect Discord First
        </Button>
      )}
    </>
  );
}
