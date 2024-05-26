import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const questProgressRouter = createTRPCRouter({
  updateUserProgress: protectedProcedure
    .input(
      z.object({
        questId: z.number(),
        completedStepId: z.number(),
        completedStepOrder: z.number(),
        isLastStep: z.boolean(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.userQuestProgress.upsert({
        create: {
          // ... data to create a UserQuestProgress
          userId: ctx.session.user.id,
          quest_id: input.questId,
          current_step_id: input.completedStepId,
          current_step_order: input.completedStepOrder,
          completed: input.isLastStep,
        },
        update: {
          userId: ctx.session.user.id,
          quest_id: input.questId,
          current_step_id: input.completedStepId,
          current_step_order: input.completedStepOrder,
          completed: input.isLastStep,
          // ... in case it already exists, update
        },
        where: {
          userId_quest_id: {
            userId: ctx.session.user.id,
            quest_id: input.questId,
          },
          // ... the filter for the UserQuestProgress we want to update
        },
      });
    }),
  getUserQuestProgress: protectedProcedure
    .input(
      z.object({
        questId: z.number(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.userQuestProgress.findUnique({
        where: {
          userId_quest_id: {
            userId: ctx.session.user.id,
            quest_id: input.questId,
          },
        },
      });
    }),

  claimXp: protectedProcedure
    .input(
      z.object({
        questId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const xpToClaim = await ctx.db.quest.findUnique({
        select: { xp_points: true },
        where: {
          quest_id: input.questId,
        },
      });
      const currentUserXp = await ctx.db.user.findUnique({
        select: { totalXP: true },
        where: {
          id: ctx.session.user.id,
        },
      });
      await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          totalXP: (currentUserXp?.totalXP ?? 0) + (xpToClaim?.xp_points ?? 0),
        },
      });

      return ctx.db.userQuestProgress.update({
        where: {
          userId_quest_id: {
            userId: ctx.session.user.id,
            quest_id: input.questId,
          },
        },
        data: {
          xp_claimed: true,
        },
      });
    }),

  getClaimedXp: protectedProcedure
    .input(
      z.object({
        questId: z.number(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.userQuestProgress.findUnique({
        select: { xp_claimed: true },
        where: {
          userId_quest_id: {
            userId: ctx.session.user.id,
            quest_id: input.questId,
          },
        },
      });
    }),
});
