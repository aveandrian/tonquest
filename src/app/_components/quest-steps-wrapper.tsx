"use client";

import { type QuestStep } from "@prisma/client";
import { QuestStepComponent } from "./quest-step";
import { useState } from "react";

export function QuestStepsWrapper({ stepsInfo }: { stepsInfo: QuestStep[] }) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  async function handleStepChange(amount: number) {
    setCurrentStep((prev) => prev + amount);
  }
  const isLastStep: boolean = currentStep === stepsInfo.length - 1;
  const currentStepInfo: QuestStep | undefined = stepsInfo[currentStep];

  if (!currentStepInfo) return null;

  return (
    <QuestStepComponent
      isLastStep={isLastStep}
      stepInfo={currentStepInfo}
      handleStepChange={handleStepChange}
    />
  );
}
