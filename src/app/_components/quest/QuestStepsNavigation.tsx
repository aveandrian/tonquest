import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type QuestStep, type UserQuestProgress } from "@prisma/client";
import { motion } from "framer-motion";

export function QuestStepsNavigation({
  userQuestProgress,
  stepsInfo,
  currentStepInfo,
  setCurrentStepIndex,
}: {
  userQuestProgress: UserQuestProgress | null;
  stepsInfo: QuestStep[];
  currentStepInfo?: QuestStep;
  setCurrentStepIndex: (i: number) => void;
}) {
  function handleStepClick(i: number) {
    if (userQuestProgress && userQuestProgress?.current_step_order < i) return;
    setCurrentStepIndex(i);
  }
  return stepsInfo.map((step, i) => (
    <div
      key={step.step_id}
      className={`relative flex grid-cols-1 items-center justify-between rounded-md border-2 border-solid border-peachYellow bg-peachYellow p-2 ${userQuestProgress && userQuestProgress?.current_step_order >= i && "hover:cursor-pointer hover:border-sandyBrown"}`}
      onClick={() => handleStepClick(i)}
    >
      <p className="z-10 font-semibold">{step.step_title}</p>
      {userQuestProgress && i <= userQuestProgress?.current_step_order && (
        <FontAwesomeIcon
          icon={faCheckCircle}
          size="lg"
          color="teal"
          className="z-10"
        />
      )}
      {currentStepInfo?.step_order === i ? (
        <motion.div
          className="absolute left-0 top-0 h-full w-full overflow-hidden rounded-md border-2 border-solid border-sandyBrown bg-sandyBrown"
          layoutId="underline"
        />
      ) : null}
    </div>
  ));
}
