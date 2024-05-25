"use client";

import { type Quest, type QuestStep } from "@prisma/client";
import { QuestStepBody } from "@/app/_components/quest/QuestStepBody";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { Spinner } from "@nextui-org/react";
import { CheckmarkAnimation } from "@/app/_components/images/CheckmarkAnimation";
import { QuestStepMint } from "@/app/_components/quest/QuestStepMint";

import { Image } from "@nextui-org/react";
import { QuestStepsNavigation } from "@/app/_components/quest/QuestStepsNavigation";

export function QuestStepsWrapper({
  stepsInfo,
  questInfo,
}: {
  stepsInfo: QuestStep[];
  questInfo: Quest;
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [currentStepInfo, setCurrentStepInfo] = useState<QuestStep | undefined>(
    stepsInfo[currentStepIndex],
  );
  const [isLastStep, setIsLastStep] = useState<boolean>(
    currentStepIndex === stepsInfo.length - 1,
  );

  const {
    data: userQuestProgress,
    refetch: refetchUserProgress,
    isLoading: isLoadingUserProgress,
  } = api.questProgress.getUserQuestProgress.useQuery({
    questId: questInfo.quest_id,
  });

  const sendStepCompleted = api.questProgress.updateUserProgress.useMutation({
    onSuccess: () => {
      setCurrentStepIndex((prev) => prev + 1);
      void refetchUserProgress();
    },
  });

  useEffect(() => {
    if (userQuestProgress?.current_step_order)
      setCurrentStepIndex(userQuestProgress.current_step_order + 1);
  }, [userQuestProgress]);

  useEffect(() => {
    setCurrentStepInfo(stepsInfo[currentStepIndex]);
    setIsLastStep(currentStepIndex === stepsInfo.length - 1);
  }, [currentStepIndex, stepsInfo]);

  async function handleStepChange(amount: number) {
    if (amount > 0 && currentStepInfo) {
      if (
        userQuestProgress &&
        currentStepInfo.step_order < userQuestProgress?.current_step_order
      ) {
        setCurrentStepIndex((prev) => prev + 1);
        return;
      }
      sendStepCompleted.mutate({
        questId: questInfo.quest_id,
        completedStepId: currentStepInfo?.step_id,
        completedStepOrder: currentStepInfo?.step_order,
        isLastStep: isLastStep,
      });
    } else setCurrentStepIndex((prev) => prev + amount);
  }

  if (!currentStepInfo && !userQuestProgress?.completed) return null;

  return (
    <div className="grid h-full min-h-[50vh]	w-full grid-cols-3 gap-x-5 sm:flex">
      <div
        className={`col-span-1 ${!isLoadingUserProgress ? "mt-auto" : "justify-center"} flex h-fit flex-col gap-1 sm:hidden`}
      >
        {isLoadingUserProgress && <Spinner className="justify-center" />}
        {!isLoadingUserProgress && userQuestProgress !== undefined && (
          <QuestStepsNavigation
            userQuestProgress={userQuestProgress}
            stepsInfo={stepsInfo}
            currentStepInfo={currentStepInfo}
          />
        )}
      </div>
      <div className="col-span-2 flex h-full min-h-[50vh] w-full flex-col items-center justify-center gap-5 rounded-lg border-5 border-double border-blue p-5 sm:p-2">
        {isLoadingUserProgress ? (
          <Spinner />
        ) : !!userQuestProgress?.completed ? (
          questInfo.nft_id ? (
            <>
              <div className="w-[50%] sm:w-full">
                <Image
                  alt="NFT image"
                  src={`https://indigo-foreign-manatee-785.mypinata.cloud/ipfs/QmP2srX58NrKRm2aomDtdkhj4uVbBuNFvhQBrWrKqwmFL9/${questInfo.nft_id}.jpg`}
                />
              </div>
              <h1 className="text-center text-2xl">
                Now you can collect your NFT!
              </h1>
              <QuestStepMint itemId={questInfo.nft_id} />
            </>
          ) : (
            <>
              <CheckmarkAnimation />
              <h1 className="text-2xl">You&apos;ve done it!</h1>
            </>
          )
        ) : (
          !userQuestProgress?.completed &&
          currentStepInfo && (
            <QuestStepBody
              isLastStep={isLastStep}
              stepInfo={currentStepInfo}
              handleStepChange={handleStepChange}
              isButtonLoading={sendStepCompleted.isPending}
              isStepCompleted={Boolean(
                userQuestProgress &&
                  currentStepInfo.step_order <
                    userQuestProgress?.current_step_id,
              )}
            />
          )
        )}
      </div>
    </div>
  );
}
