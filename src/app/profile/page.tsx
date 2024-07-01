"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { toUserFriendlyAddress } from "@tonconnect/sdk";
import { SignInButtonTON } from "@/app/_components/accounts/SignInButtonTON";
import { SignInButtonDiscord } from "@/app/_components/accounts/SignInButtonDiscord";
import { RemoveAccountButton } from "@/app/_components/accounts/RemoveAccountButton";
import { SignInButtonEVM } from "@/app/_components/accounts/SignInButtonEVM";
import { SignInButtonTwitter } from "@/app/_components/accounts/SignInButtonTwitter";
import { SignOutButton } from "@/app/_components/accounts/SignOutButton";
import { api } from "@/trpc/react";
import { Spinner } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { SignInButtonTelegram } from "@/app/_components/accounts/SignInButtonTelegram";

export default function ProfilePage() {
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

  const { data: userData, isLoading: isUserDataLoading } =
    api.user.getUser.useQuery();

  const { data: refferalsData, isLoading: isRefferalsDataLoading } =
    api.user.getRefferals.useQuery();

  const userFriendlyAddress =
    session.user.tonAddress && toUserFriendlyAddress(session.user.tonAddress);
  const truncatedAddress =
    userFriendlyAddress &&
    userFriendlyAddress.slice(0, 10) + "..." + userFriendlyAddress.slice(-10);

  const copyRefLink = () => {
    void navigator.clipboard.writeText(
      `https://tonquest.vercel.app/?ref=${userData?.refferalCode}`,
    );
    toast.success("Copied!");
  };
  return (
    <main className=" flex h-full min-h-[80vh] w-full flex-col items-center px-6">
      <div className="mt-10 flex h-full w-full max-w-[1024px] flex-col items-center justify-center gap-5">
        <h1 className="text-center text-4xl">Profile page</h1>
        <div className="grid w-full grid-cols-2 justify-items-center gap-5 sm:grid-cols-1 sm:justify-items-start ">
          <div className="flex w-full flex-col gap-5 p-5 sm:p-0">
            <div className="flex w-full flex-col gap-4">
              <p className="text-xl	 font-semibold sm:text-base">TON Wallet:</p>
              <div className="flex flex-row items-center sm:flex-col sm:gap-2 sm:text-sm">
                {session.user.tonAddress ? (
                  <p className="w-full">{truncatedAddress}</p>
                ) : (
                  <SignInButtonTON />
                )}
              </div>
            </div>
            <div className="flex w-full flex-col gap-4">
              <p className="text-xl	 font-semibold  sm:text-base">Discord:</p>
              <div className="flex flex-row items-center justify-between sm:flex-col sm:items-start sm:justify-center sm:gap-2 sm:text-sm">
                {session.user.discord ? (
                  <>
                    <p>{session.user.discord}</p>
                    <RemoveAccountButton provider="discord" />
                  </>
                ) : (
                  <SignInButtonDiscord />
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
                  <SignInButtonTwitter />
                )}
              </div>
            </div>
            <div className="flex w-full flex-col  gap-4">
              <p className="text-xl	 font-semibold  sm:text-base">EVM Wallet:</p>
              <div className="flex flex-row items-center gap-2 sm:flex-col sm:items-start sm:text-sm">
                {session.user.address ? (
                  <>
                    <p>
                      {session.user.address.slice(0, 10) +
                        "..." +
                        session.user.address.slice(-10)}
                    </p>
                    <RemoveAccountButton provider="Ethereum" />
                  </>
                ) : (
                  <SignInButtonEVM />
                )}
              </div>
            </div>
            <div className="flex w-full flex-col  gap-4">
              <p className="text-xl	 font-semibold  sm:text-base">Telegram:</p>
              <div className="flex flex-row items-center gap-2 sm:flex-col sm:items-start sm:text-sm">
                {session.user.telegramUsername ? (
                  <>
                    <p>@{session.user.telegramUsername}</p>
                    <RemoveAccountButton provider="telegram" />
                  </>
                ) : (
                  <SignInButtonTelegram />
                )}
              </div>
            </div>
          </div>
          <div>
            <div>
              {isUserDataLoading || isRefferalsDataLoading ? (
                <Spinner />
              ) : (
                <div className="flex flex-col gap-5 p-5">
                  <p className="text-xl	 font-semibold  sm:text-base">
                    Total XP: {userData?.totalXP}
                  </p>
                  <p className="text-xl	font-semibold  sm:text-base">
                    Your refferals: {refferalsData}
                  </p>
                  <div className="flex flex-col gap-1">
                    <p className="text-xl	font-semibold  sm:text-base">
                      Your refferal link: <br />
                    </p>
                    <div
                      className="flex items-center gap-2 hover:cursor-pointer"
                      onClick={copyRefLink}
                    >
                      <p className="font-normal">{`https://tonquest.vercel.app/?ref=${userData?.refferalCode}`}</p>
                      <FontAwesomeIcon icon={faCopy} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-auto w-[50%]">
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
