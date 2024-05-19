import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { client } from "@/lib/ton-api-client";
import {
  ConvertTonProofMessage,
  CreateMessage,
  SignatureVerify,
} from "@/lib/ton-proof";
import {
  type TonProofItemReplySuccess,
  type Wallet,
} from "@tonconnect/ui-react";
import {
  restTonCenterClientV3,
  restTonCenterClientV2,
} from "@/lib/ton-center-client";
import { type NftItemsInfoResponse } from "@/types/nft-items";
import { type AccountBalanceResponse } from "@/types/account-balance";

export const tonApiRouter = createTRPCRouter({
  checkTonProof: publicProcedure
    .input(
      z.object({
        walletInfo: z.object({
          account: z.object({
            address: z.string(),
          }),
          connectItems: z.object({
            tonProof: z.object({
              name: z.string(),
              proof: z.object({
                timestamp: z.number(),
                domain: z.object({
                  lengthBytes: z.number(),
                  value: z.string(),
                }),
                signature: z.string(),
                payload: z.string(),
                state_init: z.string().optional(),
              }),
            }),
          }),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      const proof = input.walletInfo.connectItems.tonProof;

      const { public_key } = await client.accounts.getAccountPublicKey(
        input.walletInfo.account.address,
      );

      const pubKey = Buffer.from(public_key, "hex");

      const parsedMessage = ConvertTonProofMessage(
        input.walletInfo as Wallet,
        proof as TonProofItemReplySuccess,
      );
      const checkMessage = await CreateMessage(parsedMessage);
      const verifyRes = SignatureVerify(
        pubKey,
        checkMessage,
        parsedMessage.Signature,
      );

      return verifyRes;
    }),
  checkIsWalletActive: publicProcedure
    .input(z.object({ publicKey: z.string() }))
    .query(({ input }) => {
      return client.wallet.getWalletsByPublicKey(input.publicKey);
    }),
  getNftItems: protectedProcedure
    .input(
      z.object({
        ownerAddress: z.string(),
        nftId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { data }: { data: NftItemsInfoResponse } =
        await restTonCenterClientV3.get("/nft/items", {
          params: {
            owner_address: input.ownerAddress, //account address,
            collection_address:
              "kQAWtUxRA9LKDY7H5-iQVOCb_JxmCgBm42F9ACVBr9kQJ_k7",
          },
        });
      const foundNft = data.nft_items.find(
        (item) =>
          item.content.uri ===
          `ipfs://QmebtGwbuzSEANpUbsRUsSWgpJgvjb9FGioFUAGE2hxFxX/${input.nftId}.json`,
      );
      return foundNft ?? false;
    }),
  getAccountBalance: protectedProcedure
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { data }: { data: AccountBalanceResponse } =
        await restTonCenterClientV2.get("/getAddressBalance", {
          params: {
            address: input.address,
          },
        });
      return data;
    }),
});
