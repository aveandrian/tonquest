"use client";
import SingInButtonDiscord from "../_components/sign-in-button-discord";
import SingInButtonTwitter from "../_components/sign-in-button-twitter";
import SingInButtonEVM from "../_components/sign-in-button-evm";
import RemoveAccountButton from "../_components/remove-account-button";
import { redirect } from "next/navigation";
import SingInButtonTON from "../_components/sign-in-button-ton";
import SignOutButton from "../_components/sign-out-button";
import { useSession } from "next-auth/react";
import { useTonAddress } from "@tonconnect/ui-react";

export default function Profile() {
  const { data: session } = useSession();
  const userFriendlyAddress = useTonAddress();

  if (!session) redirect("/");
  return (
    <main className="flex min-h-[90vh] w-full flex-col items-center border-2 border-solid px-6">
      <div className="mt-5 flex flex-col items-center gap-5">
        <h1 className="text-center text-4xl">Profile page</h1>
        <div className="flex w-full flex-col  gap-4">
          <h2 className="text-2xl">TON Wallet:</h2>
          <div className="flex flex-row items-center gap-2">
            {session.user.tonAddress ? (
              <>
                <p>{userFriendlyAddress}</p>
              </>
            ) : (
              <SingInButtonTON />
            )}
          </div>
        </div>
        <div className="flex w-full flex-col gap-4">
          <h2 className="text-2xl">Discord:</h2>
          <div className="flex flex-row items-center gap-2">
            {session.user.discord ? (
              <>
                <p>{session.user.discord}</p>
                <RemoveAccountButton provider="discord" />
              </>
            ) : (
              <SingInButtonDiscord />
            )}
          </div>
        </div>
        <div className="flex w-full flex-col  gap-4">
          <h2 className="text-2xl">Twitter:</h2>
          <div className="flex flex-row items-center gap-2">
            {session.user.twitter ? (
              <>
                <p>{session.user.twitter}</p>
                <RemoveAccountButton provider="twitter" />
              </>
            ) : (
              <SingInButtonTwitter />
            )}
          </div>
        </div>
        <div className="flex w-full flex-col  gap-4">
          <h2 className="text-2xl">EVM Wallet:</h2>
          <div className="flex flex-row items-center gap-2">
            {session.user.address ? (
              <>
                <p>{session.user.address}</p>
                <RemoveAccountButton provider="Ethereum" />
              </>
            ) : (
              <SingInButtonEVM />
            )}
          </div>
        </div>

        <SignOutButton />
      </div>
    </main>
  );
}
