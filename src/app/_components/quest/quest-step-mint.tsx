"use client";
import {
  TonConnectError,
  UserRejectsError,
  useTonAddress,
  useTonConnectUI,
} from "@tonconnect/ui-react";
import { useEffect, useState } from "react";
import { Button, Link } from "@nextui-org/react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import {
  createMintTransactionPayload,
  getTxByBOC,
} from "@/lib/ton-center-client";

const BALANCE_TO_MINT = 60000000;

export function QuestStepMint({ itemId }: { itemId: string }) {
  const [tonConnectUI] = useTonConnectUI();
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string>();
  const [buttonText, setButtonText] = useState("MINT");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const getUuid = api.mint.getUuid.useMutation();

  const address = useTonAddress();

  const { data: userNftItemInfo, isLoading: isUserNftInfoLoading } =
    api.tonApi.getNftItems.useQuery(
      {
        ownerAddress: address,
        nftId: itemId,
      },
      {
        refetchOnMount: true,
      },
    );

  const { data: userBalance, isLoading: isUserBalanceLoading } =
    api.tonApi.getAccountBalance.useQuery(
      {
        address: address,
      },
      {
        refetchOnMount: true,
      },
    );

  useEffect(() => {
    if (userNftItemInfo === undefined || !userBalance) return;
    if (parseFloat(userBalance.result) < BALANCE_TO_MINT) {
      setButtonText("You don`t have enough funds");
      setIsButtonDisabled(true);
      return;
    }
    if (userNftItemInfo) {
      setButtonText("You already own one");
      setIsButtonDisabled(true);
      return;
    }
  }, [userNftItemInfo, userBalance]);

  async function mintNextNft() {
    const token = await getUuid.mutateAsync({ wallet: address, nftId: itemId }); //await getUuid();
    const transaction = await createMintTransactionPayload(token);

    try {
      setIsLoading(true);
      const res = await tonConnectUI.sendTransaction(transaction);
      const txRes = await getTxByBOC(res.boc, address);
      setTxHash(txRes);
    } catch (e: unknown) {
      if (e instanceof TonConnectError) {
        if (e instanceof UserRejectsError) {
          toast.warning(
            "You rejected the transaction. Please confirm it to send to the blockchain",
          );
          return;
        }
        if (e.message.split("\n")[1] === "Reject request") {
          toast.warning(
            "You rejected the transaction. Please confirm it to send to the blockchain",
          );
        }
        console.log("User rejected the transaction");
      } else {
        console.log("Unknown error happened:", e);
        toast.warning(JSON.stringify(e));
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button
        isLoading={isLoading || isUserNftInfoLoading || isUserBalanceLoading}
        onClick={mintNextNft}
        isDisabled={!address || isButtonDisabled}
        className={`p-2 font-bold text-blue`}
        color="primary"
      >
        {buttonText}
      </Button>
      {txHash && (
        <p>
          Success!{" "}
          <Link
            isExternal
            anchorIcon
            href={`https://testnet.tonviewer.com/transaction/${txHash}`}
          >
            Check your transaction here
          </Link>
        </p>
      )}
    </>
  );
}
