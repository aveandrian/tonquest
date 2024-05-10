import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const questStepRouter = createTRPCRouter({
  getQuestStepsByQuestId: publicProcedure
    .input(z.object({ questId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.questStep.findMany({
        orderBy: { step_order: "asc" },
        where: {
          quest_id: input.questId,
        },
      });
    }),
});
