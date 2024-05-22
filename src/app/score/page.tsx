import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { ScoreCard } from "../_components/score/score-card";
import { UserInfo } from "../_components/score/user-info";
import { UserVolumeTable } from "../_components/score/volume-table";
import { UserNftTable } from "../_components/score/nft-table";

export default async function ScorePage() {
  const session = await getServerAuthSession();

  if (!session) redirect("/");

  return (
    <main className="flex min-h-[90vh] w-full flex-col items-center px-6 pb-10">
      <section className="flex h-fit min-h-[25vh] w-full max-w-[1024px] flex-wrap items-center justify-between rounded-md bg-peachYellow p-5 sm:flex-col sm:items-start sm:gap-5">
        <UserInfo />
        <ScoreCard score={90} />
      </section>
      <section className="grid w-full max-w-[1024px] grid-cols-2 gap-10 sm:grid-cols-1">
        <div className="w-full">
          <div className="flex flex-wrap items-center justify-between gap-2 py-5">
            <div>
              <h1>Volume stats</h1>
              <p>The volume in different projects</p>
            </div>
            <ScoreCard score={50} />
          </div>
          <UserVolumeTable />
        </div>
        <div className="w-full">
          <div className="flex flex-wrap items-center justify-between gap-2 py-5">
            <div>
              <h1>NFT stats</h1>
              <p>The NFTs you own</p>
            </div>
            <ScoreCard score={50} />
          </div>
          <UserNftTable />
        </div>
      </section>
    </main>
  );
}
