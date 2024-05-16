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
  getAllQuests: protectedProcedure.query(({ ctx }) => {
    return ctx.db.quest.findMany();
  }),
  getCompletedQuestsByUser: protectedProcedure.query(({ ctx }) => {
    return ctx.db.userQuestProgress.findMany({
      select: {
        quest: {
          select: { quest_id: true, quest_name: true, quest_description: true },
        },
      },
      where: {
        userId: ctx.session.user.id,
        completed: true,
      },
    });
  }),
  createQuest: protectedProcedure
    .input(
      z.object({
        questSlug: z.string(),
        questName: z.string(),
        questDescription: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.quest.create({
        data: {
          quest_slug: input.questSlug,
          quest_description: input.questDescription,
          quest_name: input.questName,
        },
      });
    }),

  createQuestBatch: protectedProcedure
    .input(
      z
        .object({
          questSlug: z.string(),
          questName: z.string(),
          questDescription: z.string(),
        })
        .array(),
    )
    .mutation(({ ctx, input }) => {
      const dataToCreate = input.map((item) => ({
        quest_slug: item.questSlug,
        quest_description: item.questDescription,
        quest_name: item.questName,
      }));
      return ctx.db.quest.createMany({
        data: dataToCreate,
      });
    }),
});
