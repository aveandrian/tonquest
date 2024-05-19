import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { randomUUID } from "crypto";

export const mintRouter = createTRPCRouter({
  getUuid: protectedProcedure
    .input(
      z.object({
        wallet: z.string(),
        nftId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newMint = await ctx.db.mint.create({
        data: {
          token: randomUUID(),
          wallet_string: input.wallet,
          nft_id: input.nftId,
          is_minted: false,
        },
      });
      return newMint.token;
    }),
});
