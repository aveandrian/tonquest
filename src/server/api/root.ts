import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "@/server/api/routers/user";
import { accountRouter } from "@/server/api/routers/account";
import { tonApiRouter } from "./routers/ton-api";
import { questRouter } from "./routers/quest";
import { questStepRouter } from "./routers/quest-steps";
import { questProgressRouter } from "./routers/quest-progress";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  account: accountRouter,
  tonApi: tonApiRouter,
  quest: questRouter,
  questStep: questStepRouter,
  questProgress: questProgressRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
