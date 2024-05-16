"use client";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardBody, CardFooter, Link } from "@nextui-org/react";
import { useRouter } from "next-nprogress-bar";

export function QuestCard({
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
      className="bg-peachYellow p-4 hover:scale-105"
    >
      <CardBody className="overflow-visible p-0">
        <div className="flex w-full flex-col gap-2">
          <h1 className="text-xl text-blue sm:text-sm">{questTitle}</h1>
          <p className="text-sm text-blue sm:text-xs">{questDescription}</p>
        </div>
      </CardBody>
      <CardFooter className="mt-5 flex items-center justify-between p-0 text-center text-small sm:justify-start sm:gap-2">
        <Link href={`/quest/${questSlug}`} className=" text-blue sm:text-xs">
          {isCompleted ? "Completed" : "Start quest"}
        </Link>
        {isCompleted && (
          <FontAwesomeIcon icon={faCheckCircle} color="teal" size="lg" />
        )}
      </CardFooter>
    </Card>
  );
}
