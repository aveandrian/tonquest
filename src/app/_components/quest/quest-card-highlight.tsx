"use client";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardBody, Link, Image } from "@nextui-org/react";
import { useRouter } from "next-nprogress-bar";

export function QuestCardHighlight({
  questId,
  questTitle,
  questDescription,
  questSlug,
  isCompleted,
}: {
  questId: number;
  questTitle: string;
  questDescription: string;
  questSlug: string;
  isCompleted: boolean;
}) {
  const router = useRouter();
  return (
    <Card
      shadow="sm"
      isPressable
      onPress={() => router.push(`/quest/${questSlug}`)}
      className="h-fit min-h-[25vh] w-full overflow-visible bg-peachYellow hover:scale-105"
    >
      <CardBody className="flex flex-row items-center gap-5 sm:grid sm:grid-cols-2">
        <div className="w-[25%] overflow-hidden rounded-md sm:w-[100%]">
          <Image
            alt="Woman listing to music"
            className="rounded object-contain"
            src={`/quest-images/${questId - 1}.jpeg`}
          />
        </div>
        <div className="flex w-full flex-col gap-2">
          <h1 className="text-xl text-blue">{questTitle}</h1>
          <p className="text-sm text-blue">{questDescription}</p>
        </div>
        <div className="col-span-2 ml-auto mt-auto flex flex-row gap-2">
          <Link href={`/quest/${questSlug}`} className=" text-blue">
            {isCompleted ? "Completed" : "Start quest"}
          </Link>
          {isCompleted && (
            <FontAwesomeIcon icon={faCheckCircle} color="teal" size="lg" />
          )}
        </div>
      </CardBody>
    </Card>
  );
}
