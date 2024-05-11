"use client";

import { type QuestStep } from "@prisma/client";
import { QuestStepComponent } from "./quest-step";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";

export function QuestStepsWrapper({ stepsInfo }: { stepsInfo: QuestStep[] }) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [currentStepInfo, setCurrentStepInfo] = useState<QuestStep | undefined>(
    stepsInfo[currentStepIndex],
  );
  const [isLastStep, setIsLastStep] = useState<boolean>(
    currentStepIndex === stepsInfo.length - 1,
  );

  const { data: userQuestProgress, isLoading: isUserQuestProgressLoading } =
    api.questProgress.getUserQuestProgress.useQuery({
      questId: currentStepInfo?.quest_id ?? -1,
    });

  const sendStepCompleted = api.questProgress.updateUserProgress.useMutation({
    onSuccess: () => {
      setCurrentStepIndex((prev) => prev + 1);
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
      <div className="col-span-1 mt-auto sm:hidden">
        {stepsInfo.map((step, i) => (
          <div
            key={step.step_id}
            className={`grid-cols-1 rounded-md border-2 border-solid p-2 ${currentStepInfo.step_order === i && "bg-gray-300"}`}
          >
            {step.step_title}
          </div>
        ))}
      </div>
      <QuestStepComponent
        isLastStep={isLastStep}
        stepInfo={currentStepInfo}
        handleStepChange={handleStepChange}
        isButtonLoading={sendStepCompleted.isPending}
      />
    </div>
  );
}
