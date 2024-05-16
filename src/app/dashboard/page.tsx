import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { QuestCard } from "../_components/quest-card";

export default async function DashboardPage() {
  const session = await getServerAuthSession();

  if (!session) redirect("/");

  return (
    <main className="flex min-h-[90vh] w-full flex-col items-center px-6 pb-10">
      <div className="flex h-full w-full max-w-[1024px] flex-col items-center gap-2 self-center rounded-lg border-5 border-double border-teal p-5 sm:h-fit sm:p-2 lg:w-[1024px]">
        <h1 className="text-center text-4xl">Dashboard</h1>
        <div className="grid grid-cols-4 gap-5">
          <QuestCard />
          <QuestCard />
          <QuestCard />
          <QuestCard />
        </div>
      </div>
    </main>
  );
}
