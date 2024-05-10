import { QuestStepsWrapper } from "@/app/_components/quest-steps-wrapper";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { type Quest } from "@prisma/client";

export default async function QuestWrapper({
  params,
}: {
  params: { slug: string };
}) {
  const questInfo: Quest | null = await api.quest.getQuestBySlug({
    slug: params.slug,
  });

  if (!questInfo) return <h1>Quest doesn&apos;t exist</h1>;

  const stepsInfo = await api.questStep.getQuestStepsByQuestId({
    questId: questInfo?.quest_id,
  });

  return (
    <main className="flex min-h-[90vh] w-full flex-col items-center justify-center border-2 border-solid px-6">
      <div className="flex h-full w-full max-w-[1024px] flex-col items-center gap-2 self-center rounded-lg border-2 border-double border-indigo-600 p-5 lg:w-[1024px]">
        <h1 className="text-center text-4xl font-bold">
          {questInfo.quest_name}
        </h1>
        <p className="text-center text-lg">{questInfo.quest_description}</p>
        {stepsInfo && <QuestStepsWrapper stepsInfo={stepsInfo} />}
      </div>
    </main>
  );
}
