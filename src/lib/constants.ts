import { QuestStepCompleted } from "@/app/_components/quest/QuestStepCompleted";
import { QuestStepDiscord } from "@/app/_components/quest/QuestStepDiscord";
import { QuestStepMint } from "@/app/_components/quest/QuestStepMint";
import { QuestStepText } from "@/app/_components/quest/QuestStepText";
import { QuestStepTwitter } from "@/app/_components/quest/QuestStepTwitter";

export const QUEST_TYPES = {
  1: QuestStepText,
  2: QuestStepTwitter,
  3: QuestStepDiscord,
  4: QuestStepMint,
  5: QuestStepCompleted,
};
