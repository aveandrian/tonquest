import { api } from "@/trpc/server";
import SingInButtonDiscord from "../_components/sign-in-button-discord";
import SingInButtonTwitter from "../_components/sign-in-button-twitter";
import SingInButtonEVM from "../_components/sign-in-button-evm";
import RemoveAccountButton from "../_components/remove-account-button";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import SingInButtonTON from "../_components/sign-in-button-ton";
import SignOutButton from "../_components/sign-out-button";

export default async function Profile() {
  const session = await getServerAuthSession();

  if (!session) redirect("/");

  const userInfo = await api.user.getUser();

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-4xl">Profile page</h1>
      <div>
        <h2 className="text-2xl">Discord:</h2>
        <div className="flex flex-row items-center gap-2">
          {userInfo?.discordHandle ? (
            <p>{userInfo?.discordHandle}</p>
          ) : (
            <SingInButtonDiscord />
          )}
          <RemoveAccountButton provider="discord" />
        </div>
      </div>
      <div>
        <h2 className="text-2xl">Twitter:</h2>
        <div className="flex flex-row items-center gap-2">
          {userInfo?.twitterHandle ? (
            <p>{userInfo?.twitterHandle}</p>
          ) : (
            <SingInButtonTwitter />
          )}
          <RemoveAccountButton provider="twitter" />
        </div>
      </div>
      <div>
        <h2 className="text-2xl">EVM Wallet:</h2>
        <div className="flex flex-row items-center gap-2">
          {userInfo?.address ? <p>{userInfo?.address}</p> : <SingInButtonEVM />}
          <RemoveAccountButton provider="Ethereum" />
        </div>
      </div>
      <div>
        <h2 className="text-2xl">TON Wallet:</h2>
        <div className="flex flex-row items-center gap-2">
          {userInfo?.ton_address ? (
            <p>{userInfo?.ton_address}</p>
          ) : (
            <SingInButtonTON />
          )}
          <RemoveAccountButton provider="TON" />
        </div>
      </div>
      <SignOutButton />
    </div>
  );
}
