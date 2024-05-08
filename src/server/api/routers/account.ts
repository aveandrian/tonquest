

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc"


export const accountRouter = createTRPCRouter({
    getAllUserAccounts: protectedProcedure.query(({ ctx }) => {
        return ctx.db.account.findMany({
          where: { userId: ctx.session.user.id },
        });
    }),
    getSpecificUserAccounts: protectedProcedure
        .input(z.object({ provider: z.string() }))
        .query(({ ctx, input }) => {
            return ctx.db.account.findUnique({
              where: { 
                provider_userId: {
                    userId: ctx.session.user.id,
                    provider: input.provider 
                }
            },
        });
    }),
    deleteSpecificUserAccount: protectedProcedure
        .input(z.object({provider: z.string(), fieldInDb: z.string()}))
        .mutation(async ({ctx, input}) => {
            await ctx.db.account.delete({
                where: {
                    provider_userId: {
                        userId: ctx.session.user.id,
                        provider: input.provider,
                    }
                }
            })

            return ctx.db.user.update({
                where: {
                    id: ctx.session.user.id
                },
                data: {
                    [input.fieldInDb] : null
                }
                
            })
        })
})