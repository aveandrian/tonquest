"use client";

import { Button, Link } from "@nextui-org/react";
import { type QuestStep } from "@prisma/client";
import { useSession } from "next-auth/react";
import Markdown from "react-markdown";
import { useState } from "react";

export function QuestStepDiscord({
  stepInfo,
  isCompleted,
  setIsStepReadyToBeCompleted,
}: {
  stepInfo: QuestStep;
  isCompleted: boolean;
  setIsStepReadyToBeCompleted: (isReady: boolean) => void;
}) {
  const { data: session } = useSession();

  const [isFollowClicked, setIsFollowClicked] = useState<boolean>(isCompleted);

  function handleFollow() {
    setIsFollowClicked(true);
    setIsStepReadyToBeCompleted(true);
  }

  return (
    <>
      <div className="mt-auto flex h-full flex-col items-center justify-center gap-5">
        <h1 className="mt-5 text-center text-3xl sm:w-full sm:text-xl ">
          {stepInfo.step_title}
        </h1>
        <Markdown className="w-3/4 text-center text-lg sm:w-full sm:text-sm">
          {stepInfo.step_description}
        </Markdown>
        {session?.user.discord && (
          <Button
            href="https://discord.gg/cdVjsFw4eh"
            as={Link}
            variant="solid"
            className={`${isFollowClicked ? "bg-success-200" : "bg-danger-200"} font-bold`}
            fullWidth={true}
            isExternal
            showAnchorIcon
            onClick={handleFollow}
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
      </div>
    </>
  );
}
