import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ name: z.string().min(1), email: z.string().min(1), password: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: input.password
        }, 
      });
    }),

  getUser: publicProcedure
  .input(z.object({ email: z.string().min(1) }))
  .query(({ ctx, input }) => {
    return ctx.db.user.findUnique({
      where: {
        email: input.email
      }
    })
  }),
});
