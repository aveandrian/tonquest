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
});
