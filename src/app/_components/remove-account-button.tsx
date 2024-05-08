"use client";

import { Button } from "flowbite-react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

const PROVIDER_MAP: Record<string, string> = {
  discord: "discordHandle",
  twitter: "twitterHandle",
  evm: "address",
  ton: "ton_address",
};

export default function RemoveAccountButton({
  provider,
}: {
  provider: string;
}) {
  const router = useRouter();
  const removeAccount = api.account.deleteSpecificUserAccount.useMutation({
    onSuccess: (x) => {
      console.log(x);
      router.refresh();
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
