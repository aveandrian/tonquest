import { QuestStepsWrapper } from "@/app/_components/quest/quest-steps-wrapper";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { type Quest } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function QuestWrapper({
  params,
}: {
  params: { slug: string };
}) {
  const session = await getServerAuthSession();

  if (!session) redirect("/");

  const questInfo: Quest | null = await api.quest.getQuestBySlug({
    slug: params.slug,
  });

  if (!questInfo) return <h1>Quest doesn&apos;t exist</h1>;

  const stepsInfo = await api.questStep.getQuestStepsByQuestId({
    questId: questInfo?.quest_id,
  });

  return (
    <main className="flex min-h-[90vh] w-full flex-col items-center justify-center px-6 pb-10">
      <div className="flex h-full min-h-[50vh] w-full max-w-[1024px] flex-col items-center gap-2 self-center rounded-lg border-5 border-double border-teal p-5 sm:h-fit sm:p-2 lg:w-[1024px]">
        <h1 className="text-center text-4xl sm:w-full sm:text-2xl">
          {questInfo.quest_name}
        </h1>
        <p className="text-center text-lg sm:w-full sm:text-base">
          {questInfo.quest_description}
        </p>
        {stepsInfo && (
          <QuestStepsWrapper stepsInfo={stepsInfo} questInfo={questInfo} />
        )}
      </div>
    </main>
  );
}
