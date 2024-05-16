import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

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

  createQuestStep: protectedProcedure
    .input(
      z.object({
        questId: z.number(),
        stepType: z.number(),
        stepTitle: z.string(),
        stepDescription: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.questStep.create({
        data: {
          quest_id: input.questId,
          step_type: input.stepType,
          step_title: input.stepTitle,
          step_description: input.stepDescription,
          step_order: 0,
        },
      });
    }),

  createQuestStepBatch: protectedProcedure
    .input(
      z
        .object({
          questId: z.number(),
          stepType: z.number(),
          stepTitle: z.string(),
          stepDescription: z.string(),
          stepOrder: z.number(),
        })
        .array(),
    )
    .mutation(({ ctx, input }) => {
      const data = input.map((step) => ({
        quest_id: step.questId,
        step_type: step.stepType,
        step_title: step.stepTitle,
        step_description: step.stepDescription,
        step_order: step.stepOrder,
      }));
      return ctx.db.questStep.createMany({
        data: data,
      });
    }),
});
