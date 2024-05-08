"use client";

import { Button } from "flowbite-react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useDisconnect } from "wagmi";

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

  const router = useRouter();
  const removeAccount = api.account.deleteSpecificUserAccount.useMutation({
    onSuccess: () => {
      router.refresh();
      if (provider === "Ethereum") {
        disconnect();
      }
    },
  });

  return (
    <Button
      onClick={() =>
        removeAccount.mutate({
          provider: provider,
          fieldInDb: PROVIDER_MAP[provider] ?? "",
        })
      }
    >
      Remove account
    </Button>
  );
}
