import { QuestStepCompleted } from "@/app/_components/quest/QuestStepCompleted";
import { QuestStepDiscord } from "@/app/_components/quest/QuestStepDiscord";
import { QuestStepMint } from "@/app/_components/quest/QuestStepMint";
import { QuestStepText } from "@/app/_components/quest/QuestStepText";
import { QuestStepTwitter } from "@/app/_components/quest/QuestStepTwitter";
import { type QuestTypesProps } from "@/types/quest-types-props";

export const QUEST_TYPES: Record<
  number,
  React.ComponentType<QuestTypesProps>
> = {
  1: QuestStepText,
  2: QuestStepTwitter,
  3: QuestStepDiscord,
  4: QuestStepMint,
  5: QuestStepCompleted,
};
