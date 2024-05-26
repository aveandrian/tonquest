"use client";
import { Button } from "@nextui-org/react";
import { type QuestStep } from "@prisma/client";
import Markdown from "react-markdown";

export function QuestStepText({
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
  return (
    <div className="col-span-2 flex h-full min-h-[50vh] w-full flex-col items-center justify-center gap-5 rounded-lg border-5 border-double border-blue p-5 sm:p-2">
      <div className="mt-auto flex h-full flex-col items-center justify-center gap-5">
        <h1 className="mt-5 text-center text-3xl sm:w-full sm:text-xl ">
          {stepInfo.step_title}
        </h1>
        <Markdown className="w-3/4 text-center text-lg sm:w-full sm:text-sm">
          {stepInfo.step_description}
        </Markdown>
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
          isDisabled={!isStepCompleted}
          className="ml-auto font-bold"
          color="primary"
          isLoading={isButtonLoading}
        >
          {isLastStep ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
}
