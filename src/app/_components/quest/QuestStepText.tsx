"use client";
import { type QuestStep } from "@prisma/client";
import Markdown from "react-markdown";

export function QuestStepText({ stepInfo }: { stepInfo: QuestStep }) {
  return (
    <>
      <div className="mt-auto flex h-full flex-col items-center justify-center gap-5">
        <h1 className="mt-5 text-center text-3xl sm:w-full sm:text-xl ">
          {stepInfo.step_title}
        </h1>
        <Markdown className="w-3/4 text-center text-lg sm:w-full sm:text-sm">
          {stepInfo.step_description}
        </Markdown>
      </div>
    </>
  );
}
