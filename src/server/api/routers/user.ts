import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });
  }),
  getRefferals: protectedProcedure.query(async ({ ctx }) => {
    const currentUser = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });
    if (!currentUser?.refferalCode) return 0;
    return ctx.db.user.count({
      where: {
        refferedBy: currentUser.refferalCode,
      },
    });
  }),
});
