"use client";

import { Button, Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next-nprogress-bar";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { api } from "@/trpc/react";
import { QuestCard } from "@/app/_components/quest/QuestCard";
import { QuestCardHighlight } from "@/app/_components/quest/QuestCardHighlight";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [shouldShowDashboard, setShouldShowDashboard] = useState(false);

  const { data: session } = useSession();

  const [showPopup, setShowPopup] = useState<boolean>(false);

  function handleClick() {
    if (!session) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } else router.push("quest/first-quest");
  }

  useEffect(() => {
    if (searchParams.get("ref"))
      localStorage.setItem("tonquest-ref", searchParams.get("ref") ?? "");
  }, [searchParams]);

  const completedQuestsByUser = session
    ? api.quest.getCompletedQuestsByUser.useQuery()
    : null;

  const allQuests = session ? api.quest.getAllQuests.useQuery() : null;

  const questHighlight = allQuests?.data?.at(0);

  const handleSkipFirstQuest = () => {
    localStorage.setItem("skipFirstQuest", JSON.stringify("true"));
    setShouldShowDashboard(true);
  };

  useEffect(() => {
    if (!session) return setShouldShowDashboard(false);

    if (session && localStorage.getItem("skipFirstQuest")) {
      return setShouldShowDashboard(true);
    }
    if (
      completedQuestsByUser &&
      !completedQuestsByUser?.isLoading &&
      completedQuestsByUser?.data?.length
    ) {
      return setShouldShowDashboard(true);
    }
    setShouldShowDashboard(false);
  }, [completedQuestsByUser, session]);

  return (
    <main className="relative mt-10 flex h-full min-h-[80vh] w-full max-w-[1024px] flex-col items-center justify-center self-center px-6 pb-5 sm:px-3">
      {showPopup && (
        <div className="rounder-md absolute right-5 top-0 flex animate-bounce flex-col items-center justify-center px-3 py-2">
          <FontAwesomeIcon icon={faArrowUp} />
          <p className="text-center">log in first</p>
        </div>
      )}
      {completedQuestsByUser?.isLoading && <Spinner />}
      {!shouldShowDashboard && (
        <>
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform bg-[url('/bg-main.png')] bg-contain bg-no-repeat sm:h-80 sm:w-80"></div>
          <Button
            onClick={handleClick}
            color="primary"
            className="start-first my-auto font-bold"
            isLoading={completedQuestsByUser?.isLoading}
          >
            Start your first quest
          </Button>
          {session && (
            <p
              onClick={handleSkipFirstQuest}
              className="absolute bottom-5 right-1/4 font-semibold hover:cursor-pointer hover:underline hover:decoration-2 hover:underline-offset-2"
            >
              Go to dashboard <FontAwesomeIcon icon={faArrowRight} />
            </p>
          )}
        </>
      )}
      {shouldShowDashboard && session && (
        <>
          {questHighlight && (
            <QuestCardHighlight
              questId={questHighlight.quest_id}
              questTitle={questHighlight.quest_name}
              questDescription={questHighlight.quest_description}
              questSlug={questHighlight.quest_slug}
              isCompleted={
                completedQuestsByUser
                  ? Boolean(
                      completedQuestsByUser?.data?.length &&
                        completedQuestsByUser?.data.find(
                          (completedQuest) =>
                            completedQuest.quest.quest_id ===
                            questHighlight.quest_id,
                        ),
                    )
                  : false
              }
            />
          )}
          <div className="mt-5 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl">Starting quests</h1>
              <p className="text-sm">
                One small step for human and a giant leap for humanity
              </p>
            </div>
            <div className="grid w-full grid-cols-3 gap-5 sm:grid-cols-2 sm:gap-5">
              {allQuests?.data?.map((quest) => (
                <QuestCard
                  key={quest.quest_id}
                  questId={quest.quest_id}
                  questTitle={quest.quest_name}
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
