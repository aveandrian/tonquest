"use client";
import { api } from "@/trpc/react";
import { Image, Card, CardFooter, Spinner } from "@nextui-org/react";
import { useTonAddress } from "@tonconnect/ui-react";

export function UserNftTable() {
  const address = useTonAddress();
  const { data: userNftItems, isLoading: isUserNftInfoLoading } =
    api.tonApi.getAllAccountNfts.useQuery(
      {
        ownerAddress: address,
      },
      {
        refetchOnMount: true,
      },
    );
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-1">
      {isUserNftInfoLoading && <Spinner />}
      {userNftItems?.length === 0 && <p>You don&apos;t own any NFTs</p>}
      {userNftItems?.map((nftItem) => (
        <Card
          key={nftItem.address}
          isFooterBlurred
          radius="lg"
          className="border-none"
        >
          <Image
            alt="NFT item preview"
            src={nftItem.previews ? nftItem.previews[2]?.url : ""}
            width={"100%"}
            height={"100%"}
          />
          <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
            <p className="text-sm font-bold text-blue">
              {nftItem.metadata.name}
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
