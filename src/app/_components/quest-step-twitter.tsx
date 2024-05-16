"use client";

import { Button, Link } from "@nextui-org/react";
import { useSession } from "next-auth/react";

export function QuestStepTwitter({
  isFollowClicked,
  handleFollowClick,
}: {
  isFollowClicked: boolean;
  handleFollowClick: () => void;
}) {
  const { data: session } = useSession();
  return (
    <>
      {session?.user.twitter && (
        <Button
          href="https://twitter.com/aveandrian"
          as={Link}
          variant="solid"
          className={`${isFollowClicked ? "bg-success-200" : "bg-danger-200"} font-bold`}
          fullWidth={true}
          isExternal
          showAnchorIcon
          onClick={handleFollowClick}
        >
          Follow Twitter
        </Button>
      )}
      {!session?.user.twitter && (
        <Button
          href="/profile"
          as={Link}
          variant="solid" //
          className="to-blue-500 w-fit bg-gradient-to-l from-cyan-500 px-5 font-bold"
        >
          Connect Twitter First
        </Button>
      )}
    </>
  );
}
