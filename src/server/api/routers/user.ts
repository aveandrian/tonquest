import { createTRPCRouter, protectedProcedure } from "../trpc"


export const userRouter = createTRPCRouter({
    getUser: protectedProcedure.query(({ ctx }) => {
        return ctx.db.user.findUnique({
          where: { id: ctx.session.user.id },
        });
    }),
})