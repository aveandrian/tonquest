import { getServerAuthSession } from "@/server/auth";
import SingInButtonDiscord from "./_components/sign-in-button-discord";
import SingInButtonTwitter from "./_components/sign-in-button-twitter";
import SingInButtonEVM from "./_components/sign-in-button-evm";
import Link from "next/link";
import SingInButtonTON from "./_components/sign-in-button-ton";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="flex flex-col items-center justify-center gap-12 border border-black  px-4 py-16">
        {!session && <>
          <SingInButtonDiscord />
          <SingInButtonTwitter />
          <SingInButtonEVM />
          <SingInButtonTON />
        </>
        }
        {
          !!session && <Link href={'profile'}>Go to My Profile</Link>
        }
      </div>
    </main>
  );
}