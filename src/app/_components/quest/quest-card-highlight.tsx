"use client";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardBody, CardFooter, Link } from "@nextui-org/react";
import { useRouter } from "next-nprogress-bar";

export function QuestCardHighlight({
  questTitle,
  questDescription,
  questSlug,
  isCompleted,
}: {
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
      className="h-full w-full bg-peachYellow p-4 hover:scale-105"
    >
      <CardBody className="overflow-visible p-0">
        <div className="flex w-full flex-col gap-2">
          <h1 className="text-xl text-blue">{questTitle}</h1>
          <p className="text-sm text-blue">{questDescription}</p>
        </div>
      </CardBody>
      <CardFooter className="mt-5 flex items-center justify-end gap-5 p-0 text-center text-small ">
        <Link href={`/quest/${questSlug}`} className="text-blue">
          {isCompleted ? "Completed" : "Start quest"}
        </Link>
        {isCompleted && (
          <FontAwesomeIcon icon={faCheckCircle} color="teal" size="lg" />
        )}
      </CardFooter>
    </Card>
  );
}
