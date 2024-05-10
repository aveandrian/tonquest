import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const questRouter = createTRPCRouter({
  getQuestBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.quest.findUnique({
        where: { quest_slug: input.slug },
      });
    }),
});
