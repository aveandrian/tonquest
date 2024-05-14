"use client";
import SingInButtonDiscord from "../_components/sign-in-button-discord";
import SingInButtonTwitter from "../_components/sign-in-button-twitter";
import SingInButtonEVM from "../_components/sign-in-button-evm";
import RemoveAccountButton from "../_components/remove-account-button";
import { redirect } from "next/navigation";
import SingInButtonTON from "../_components/sign-in-button-ton";
import SignOutButton from "../_components/sign-out-button";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { toUserFriendlyAddress } from "@tonconnect/sdk";

export default function Profile() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error === "OAuthAccountNotLinked") {
      toast.dismiss("accountNotLinked");
      toast.error("Account already linked to another user.", {
        id: "accountNotLinked",
        duration: 2000,
      });
    }
  }, [error]);

  if (!session) redirect("/");
  return (
    <main className=" flex min-h-[90vh] w-full flex-col items-center px-6">
      <div className="my-auto flex h-full w-full max-w-[1024px] flex-col items-center justify-center gap-5">
        <h1 className="text-center text-4xl">Profile page</h1>
        <div className="flex w-full flex-col gap-4">
          <p className="text-xl	 font-semibold sm:text-base">TON Wallet:</p>
          <div className="flex flex-row items-center gap-2 sm:flex-col sm:text-sm">
            {session.user.tonAddress ? (
              <p>{toUserFriendlyAddress(session.user.tonAddress)}</p>
            ) : (
              <SingInButtonTON />
            )}
          </div>
        </div>
        <div className="flex w-full flex-col gap-4">
          <p className="text-xl	 font-semibold  sm:text-base">Discord:</p>
          <div className="flex flex-row items-center gap-2 sm:flex-col sm:items-start sm:text-sm">
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
          <p className="text-xl	 font-semibold  sm:text-base">Twitter:</p>
          <div className="flex flex-row items-center gap-2 sm:flex-col sm:items-start sm:text-sm">
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
          <p className="text-xl	 font-semibold  sm:text-base">EVM Wallet:</p>
          <div className="flex flex-row items-center gap-2 sm:flex-col sm:items-start sm:text-sm">
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
