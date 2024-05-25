"use client";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardFooter, Link, Image, Button } from "@nextui-org/react";
import { useRouter } from "next-nprogress-bar";

export function QuestCard({
  questId,
  questTitle,
  questSlug,
  isCompleted,
}: {
  questId: number;
  questTitle: string;
  questSlug: string;
  isCompleted: boolean;
}) {
  const router = useRouter();
  return (
    <Card
      shadow="sm"
      isPressable
      onPress={() => router.push(`/quest/${questSlug}`)}
      className="quest-card bg-peachYellow pb-4 hover:scale-105"
      isFooterBlurred
    >
      <Image
        alt="Woman listing to music"
        className="object-cover"
        isBlurred
        height={"100%"}
        src={`/quest-images/${questId - 1}.jpeg`}
        width={"100%"}
      />
      <CardFooter className="absolute bottom-0 left-0 z-10 flex w-full flex-row justify-between overflow-hidden rounded-large border-1 border-white/20 bg-peachYellow bg-opacity-60 py-3 shadow-small before:rounded-xl before:bg-white/10 sm:px-1">
        <h1 className="text-start text-sm text-blue sm:text-sm">
          {questTitle}
        </h1>
        {!isCompleted && (
          <Button
            as={Link}
            href={`/quest/${questSlug}`}
            className="text-sm font-bold text-blue sm:text-xs"
            color="primary"
          >
            Start
          </Button>
        )}
        {isCompleted && (
          <FontAwesomeIcon icon={faCheck} color="teal" size="lg" />
        )}
      </CardFooter>
    </Card>
  );
}
