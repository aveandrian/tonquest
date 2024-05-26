"use client";
import { CheckmarkAnimation } from "@/app/_components/images/CheckmarkAnimation";
import { api } from "@/trpc/react";
import { Button } from "@nextui-org/react";
import { type QuestStep } from "@prisma/client";
import { useState } from "react";

export function QuestStepCompleted({
  stepInfo,
}: {
  stepInfo: QuestStep;
  isCompleted: boolean;
}) {
  const [isButtonDisabled] = useState(false);

  const {
    data: isXpClaimed,
    isLoading: isXpClaimedLoading,
    refetch: isXpClaimedRefetch,
  } = api.questProgress.getClaimedXp.useQuery({
    questId: stepInfo.quest_id,
  });

  const claimXp = api.questProgress.claimXp.useMutation({
    onSuccess: () => isXpClaimedRefetch(),
  });

  return (
    <div className="mt-auto flex h-full flex-col items-center justify-center gap-5">
      <CheckmarkAnimation />
      <h1 className="text-2xl">You&apos;ve done it!</h1>
      <Button
        color="primary"
        className="font-bold"
        isLoading={claimXp.isPending || isXpClaimedLoading}
        isDisabled={isButtonDisabled || isXpClaimed?.xp_claimed}
        onClick={() => claimXp.mutateAsync({ questId: stepInfo.quest_id })}
      >
        {isXpClaimed?.xp_claimed ? "Claimed" : "Claim"} 45 XP
      </Button>
    </div>
  );
}
