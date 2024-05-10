"use client";

import { Button } from "@nextui-org/react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useDisconnect } from "wagmi";
import { useSession } from "next-auth/react";

const PROVIDER_MAP: Record<string, string> = {
  discord: "discordHandle",
  twitter: "twitterHandle",
  Ethereum: "address",
  TON: "ton_address",
};

export default function RemoveAccountButton({
  provider,
}: {
  provider: string;
}) {
  const { disconnect } = useDisconnect();
  const { update } = useSession();

  const router = useRouter();
  const removeAccount = api.account.deleteSpecificUserAccount.useMutation({
    onSuccess: async () => {
      if (provider === "twitter") {
        await update({ twitter: null });
      }

      if (provider === "discord") {
        await update({ discord: null });
      }

      // router.refresh();
      if (provider === "Ethereum") {
        disconnect();
      }
    },
  });

  return (
    <>
      <Button
        className="ml-auto"
        onClick={() =>
          removeAccount.mutate({
            provider: provider,
            fieldInDb: PROVIDER_MAP[provider] ?? "",
          })
        }
      >
        Remove account
      </Button>
    </>
  );
}
