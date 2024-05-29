"use client";

import { type Quest, type QuestStep } from "@prisma/client";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { Button, Spinner } from "@nextui-org/react";

import { QuestStepsNavigation } from "@/app/_components/quest/QuestStepsNavigation";
import { QUEST_TYPES } from "@/lib/constants";
import { type QuestTypesProps } from "@/types/quest-types-props";

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
    currentStepIndex === stepsInfo.length - 2,
  );

  const [isStepReadyToBeCompleted, setIsStepReadyToBeCompleted] =
    useState<boolean>(false);

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
    setIsLastStep(currentStepIndex === stepsInfo.length - 2);
  }, [currentStepIndex, stepsInfo]);

  useEffect(() => {
    if (!userQuestProgress || !currentStepInfo) {
      setIsStepReadyToBeCompleted(true);
      return;
    }
    if (userQuestProgress?.current_step_order >= currentStepInfo?.step_order) {
      setIsStepReadyToBeCompleted(true);
      return;
    } else if (
      currentStepInfo?.step_type_id !== 2 &&
      currentStepInfo?.step_type_id !== 3
    ) {
      setIsStepReadyToBeCompleted(true);
      return;
    }

    setIsStepReadyToBeCompleted(false);
  }, [
    currentStepInfo,
    userQuestProgress,
    userQuestProgress?.current_step_order,
  ]);

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

  function renderStep(props: QuestTypesProps) {
    if (currentStepInfo?.step_type_id) {
      const QuestComponent = QUEST_TYPES[currentStepInfo?.step_type_id];
      return QuestComponent ? <QuestComponent {...props} /> : null;
    }
  }

  return (
    <div className="grid h-full min-h-[50vh]	w-full grid-cols-3 gap-x-5 sm:flex">
      <div className="col-span-1 flex h-full flex-col justify-end gap-2 sm:hidden">
        {isLoadingUserProgress && <Spinner className="mb-[50%]" />}
        {!isLoadingUserProgress && userQuestProgress !== undefined && (
          <QuestStepsNavigation
            userQuestProgress={userQuestProgress}
            stepsInfo={stepsInfo}
            currentStepInfo={currentStepInfo}
            setCurrentStepIndex={setCurrentStepIndex}
          />
        )}
      </div>
      <div className="col-span-2 flex h-full min-h-[50vh] w-full flex-col items-center justify-center gap-5 rounded-lg border-5 border-double border-blue p-5 sm:p-2">
        {isLoadingUserProgress && <Spinner />}
        {!isLoadingUserProgress &&
          currentStepInfo &&
          renderStep({
            stepInfo: currentStepInfo,
            isCompleted: userQuestProgress
              ? userQuestProgress?.current_step_order >=
                currentStepInfo.step_order
              : false,
            setIsStepReadyToBeCompleted: setIsStepReadyToBeCompleted,
          })}
        {!isLoadingUserProgress && currentStepInfo && (
          <div className="mt-auto flex w-full flex-row">
            {currentStepInfo?.step_order > 0 &&
              currentStepInfo?.step_order < stepsInfo.length - 1 && (
                <Button
                  onClick={() => handleStepChange(-1)}
                  className="bg-secondary font-bold text-[#F0FFF0]"
                >
                  Back
                </Button>
              )}
            {currentStepInfo?.step_order < stepsInfo.length - 1 && (
              <Button
                onClick={() => handleStepChange(1)}
                isDisabled={!isStepReadyToBeCompleted}
                className="ml-auto font-bold"
                color="primary"
                isLoading={sendStepCompleted.isPending}
              >
                {isLastStep ? "Finish" : "Next"}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
