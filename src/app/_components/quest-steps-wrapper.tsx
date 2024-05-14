"use client";

import { type QuestStep } from "@prisma/client";
import { QuestStepComponent } from "./quest-step";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "@nextui-org/react";

export function QuestStepsWrapper({ stepsInfo }: { stepsInfo: QuestStep[] }) {
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
    questId: currentStepInfo?.quest_id ?? -1,
  });

  const sendStepCompleted = api.questProgress.updateUserProgress.useMutation({
    onSuccess: () => {
      setCurrentStepIndex((prev) => prev + 1);
      void refetchUserProgress();
    },
  });

  useEffect(() => {
    setCurrentStepInfo(stepsInfo[currentStepIndex]);
    setIsLastStep(currentStepIndex === stepsInfo.length - 1);
  }, [currentStepIndex, stepsInfo]);

  useEffect(() => {
    if (userQuestProgress)
      setCurrentStepIndex(
        userQuestProgress?.current_step_id
          ? userQuestProgress?.current_step_id
          : 0,
      );
  }, [userQuestProgress]);

  async function handleStepChange(amount: number) {
    if (amount > 0 && currentStepInfo) {
      if (
        userQuestProgress &&
        currentStepInfo.step_order < userQuestProgress?.current_step_id
      ) {
        setCurrentStepIndex((prev) => prev + 1);
        return;
      }
      sendStepCompleted.mutate({
        questId: currentStepInfo?.quest_id,
        completedStepId: currentStepInfo?.step_id,
        isLastStep: isLastStep,
      });
    } else setCurrentStepIndex((prev) => prev + amount);
  }

  if (!currentStepInfo) return null;

  return (
    <div className="grid h-full	w-full grid-cols-3 gap-x-5 sm:flex">
      <div
        className={`col-span-1 ${!isLoadingUserProgress ? "mt-auto" : "justify-center"} flex flex-col gap-1 sm:hidden`}
      >
        {isLoadingUserProgress && <Spinner className="justify-center" />}
        {!isLoadingUserProgress &&
          userQuestProgress !== undefined &&
          stepsInfo.map((step, i) => (
            <div
              key={step.step_id}
              className={`flex grid-cols-1 items-center gap-2 rounded-md border-2 border-solid p-2 ${currentStepInfo?.step_order === i ? "border-sandyBrown bg-sandyBrown" : "border-peachYellow bg-peachYellow"}`}
            >
              {userQuestProgress && i < userQuestProgress?.current_step_id && (
                <FontAwesomeIcon icon={faCheckCircle} size="lg" color="teal" />
              )}
              <p>{step.step_title}</p>
            </div>
          ))}
      </div>
      {isLoadingUserProgress ? (
        <div className=" col-span-2 flex h-full min-h-[50vh] w-full flex-col items-center justify-center gap-5 rounded-lg border-5 border-double border-blue p-5">
          {" "}
          <Spinner></Spinner>
        </div>
      ) : (
        <QuestStepComponent
          isLastStep={isLastStep}
          stepInfo={currentStepInfo}
          handleStepChange={handleStepChange}
          isButtonLoading={sendStepCompleted.isPending}
          isStepCompleted={Boolean(
            userQuestProgress &&
              currentStepInfo.step_order < userQuestProgress?.current_step_id,
          )}
        />
      )}
    </div>
  );
}
