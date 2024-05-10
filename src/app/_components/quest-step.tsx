"use client";

import { Button, Link } from "@nextui-org/react";
import { type User, type QuestStep } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function QuestStepComponent({
  stepInfo,
  handleStepChange,
  isLastStep,
}: {
  stepInfo: QuestStep;
  handleStepChange: (x: number) => void;
  isLastStep: boolean;
}) {
  const { data: session } = useSession();
  const isTwitterQuest = stepInfo.step_type === 1;
  const [isFollowClicked, setIsFollowClicked] = useState<boolean>(true);

  useEffect(() => {
    if (stepInfo.step_type === 1) setIsFollowClicked(false);
  }, [stepInfo.step_type]);

  function handleFollowClick() {
    setIsFollowClicked(true);
  }

  return (
    <div className="border-1-black flex h-[50vh] w-full flex-col items-center justify-center gap-5 rounded-lg border-2 border-double border-indigo-200 p-5">
      <div className="flex h-full flex-col items-center justify-center gap-5">
        <h1 className="mt-5 text-center text-3xl font-bold">
          {stepInfo.step_title}
        </h1>
        <p className="w-3/4 text-center text-lg">{stepInfo.step_description}</p>
        {!session && (
          <p className="underline underline-offset-4">
            You need to log in first
          </p>
        )}
        {session && isTwitterQuest && session?.user.twitter && (
          <Button
            href="https://twitter.com/aveandrian"
            as={Link}
            variant="solid"
            fullWidth={true}
            isExternal
            showAnchorIcon
            onClick={handleFollowClick}
          >
            Follow Twitter
          </Button>
        )}
        {session && isTwitterQuest && !session?.user.twitter && (
          <Button href="/profile" as={Link} variant="solid" fullWidth={true}>
            Connect Twitter First
          </Button>
        )}
      </div>
      <div className="mt-auto flex w-full flex-row">
        {stepInfo.step_order > 0 && (
          <Button onClick={() => handleStepChange(-1)}>Back</Button>
        )}
        <Button
          onClick={() => handleStepChange(1)}
          isDisabled={isLastStep || (isTwitterQuest && !isFollowClicked)}
          className="ml-auto"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
