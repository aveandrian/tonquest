import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { client } from "@/lib/tonApiClient";
import {
  ConvertTonProofMessage,
  CreateMessage,
  SignatureVerify,
} from "@/lib/tonProof";
import {
  type TonProofItemReplySuccess,
  type Wallet,
} from "@tonconnect/ui-react";

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
});
