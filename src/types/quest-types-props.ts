import { type QuestStep } from "@prisma/client";

export interface QuestTypesProps {
  stepInfo: QuestStep;
  isCompleted: boolean;
  setIsStepReadyToBeCompleted: (isReady: boolean) => void;
}
