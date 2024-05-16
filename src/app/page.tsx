"use client";

import { Button, Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next-nprogress-bar";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { api } from "@/trpc/react";
import { QuestCard } from "./_components/quest-card";
import { QuestCardHighlight } from "./_components/quest-card-highlight";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  const [showPopup, setShowPopup] = useState<boolean>(false);

  function handleClick() {
    if (!session) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } else router.push("quest/first-quest");
  }

  const completedQuestsByUser = session
    ? api.quest.getCompletedQuestsByUser.useQuery()
    : null;

  const allQuests = session ? api.quest.getAllQuests.useQuery() : null;

  const questHighlight = allQuests?.data?.at(0);

  return (
    <main className="container relative mt-10 flex h-full min-h-[80vh] w-full max-w-[1024px] flex-col items-center self-center px-6 sm:px-3">
      {showPopup && (
        <div className="rounder-md absolute right-5 top-5 flex animate-bounce flex-col items-center justify-center px-3 py-2">
          <FontAwesomeIcon icon={faArrowUp} />
          <p className="text-center">log in first</p>
        </div>
      )}
      {completedQuestsByUser?.isLoading && <Spinner />}
      {!completedQuestsByUser?.isLoading &&
        !completedQuestsByUser?.data?.length && (
          <>
            <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform bg-[url('/bg-main.png')] bg-contain bg-no-repeat sm:h-80 sm:w-80"></div>
            <Button
              onClick={handleClick}
              color="primary"
              className="start-first my-auto"
              isLoading={completedQuestsByUser?.isLoading}
            >
              Start your first quest
            </Button>
          </>
        )}
      {completedQuestsByUser &&
        !completedQuestsByUser.isLoading &&
        (completedQuestsByUser?.data?.length ?? 0) > 0 && (
          <>
            <div className="h-[20vh] w-full">
              {questHighlight && (
                <QuestCardHighlight
                  questTitle={questHighlight.quest_name}
                  questDescription={questHighlight.quest_description}
                  questSlug={questHighlight.quest_slug}
                  isCompleted={
                    Boolean(
                      completedQuestsByUser?.data?.length &&
                        completedQuestsByUser?.data.find(
                          (completedQuest) =>
                            completedQuest.quest.quest_id ===
                            questHighlight.quest_id,
                        ),
                    ) ?? false
                  }
                />
              )}
            </div>
            <div className="mt-5 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-lg">Starting quests</h1>
                <p className="text-xs">
                  One small step for human and a giant leap for humanity
                </p>
              </div>
              <div className="grid w-full grid-cols-4 gap-5 sm:grid-cols-2 sm:gap-2">
                {allQuests?.data?.map((quest) => (
                  <QuestCard
                    key={quest.quest_id}
                    questTitle={quest.quest_name}
                    questDescription={quest.quest_description}
                    questSlug={quest.quest_slug}
                    isCompleted={
                      Boolean(
                        completedQuestsByUser?.data?.length &&
                          completedQuestsByUser?.data.find(
                            (completedQuest) =>
                              completedQuest.quest.quest_id === quest.quest_id,
                          ),
                      ) ?? false
                    }
                  />
                ))}
              </div>
            </div>
          </>
        )}
    </main>
  );
}
