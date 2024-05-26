import { CheckmarkAnimation } from "@/app/_components/images/CheckmarkAnimation";

export function QuestStepCompleted() {
  return (
    <div className="mt-auto flex h-full flex-col items-center justify-center gap-5">
      <CheckmarkAnimation />
      <h1 className="text-2xl">You&apos;ve done it!</h1>
    </div>
  );
}
