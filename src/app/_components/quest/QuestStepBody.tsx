"use client";

import { Button } from "@nextui-org/react";
import { type QuestStep } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { QuestStepTwitter } from "@/app/_components/quest/QuestStepTwitter";
import { QuestStepDiscord } from "@/app/_components/quest/QuestStepDiscord";
import Markdown from "react-markdown";

export function QuestStepBody({
  stepInfo,
  handleStepChange,
  isLastStep,
  isButtonLoading,
  isStepCompleted,
}: {
  stepInfo: QuestStep;
  handleStepChange: (x: number) => void;
  isLastStep: boolean;
  isButtonLoading: boolean;
  isStepCompleted: boolean;
}) {
  const { data: session } = useSession();
  const isTwitterQuest = stepInfo.step_type_id === 2;
  const isDiscordQuest = stepInfo.step_type_id === 3;

  const [isFollowClicked, setIsFollowClicked] = useState<boolean>(true);

  useEffect(() => {
    if (
      (stepInfo.step_type_id === 2 && !isStepCompleted) ||
      (stepInfo.step_type_id === 3 && !isStepCompleted)
    )
      setIsFollowClicked(false);
  }, [isStepCompleted, stepInfo.step_type_id]);

  function handleFollowClick() {
    setIsFollowClicked(true);
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
        {!session && (
          <p className="underline underline-offset-4">
            You need to log in first
          </p>
        )}
        {isTwitterQuest && (
          <QuestStepTwitter
            handleFollowClick={handleFollowClick}
            isFollowClicked={isFollowClicked}
          />
        )}
        {isDiscordQuest && (
          <QuestStepDiscord
            handleFollowClick={handleFollowClick}
            isFollowClicked={isFollowClicked}
          />
        )}
      </div>
      <div className="mt-auto flex w-full flex-row">
        {stepInfo.step_order > 0 && (
          <Button
            onClick={() => handleStepChange(-1)}
            className="bg-secondary font-bold text-[#F0FFF0]"
          >
            Back
          </Button>
        )}
        <Button
          onClick={() => handleStepChange(1)}
          isDisabled={
            !isStepCompleted &&
            (isTwitterQuest || isDiscordQuest) &&
            !isFollowClicked
          }
          className="ml-auto font-bold"
          color="primary"
          isLoading={isButtonLoading}
        >
          {isLastStep ? "Finish" : "Next"}
        </Button>
      </div>
    </>
  );
}