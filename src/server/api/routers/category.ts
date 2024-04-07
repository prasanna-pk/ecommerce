import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const categoryRouter = createTRPCRouter({
  getAllCategories: publicProcedure
  .query(async ({ ctx }) => {
    return await ctx.db.category.findMany({
      include: {
        users: true
      }
    })
  }),

  connectToUser: publicProcedure
  .input(z.object({ id: z.number().min(1), category: z.number().min(1)  }))
  .mutation(async ({ ctx, input }) => {
    return await ctx.db.category.update({
      where: {
        id: input.category
      },
      data: {
        users: { connect : [ {
          id: input.id
        } ] }
      }, 
    })
  }),

  disconnectFromUser: publicProcedure
  .input(z.object({ id: z.number().min(1), category: z.number().min(1)  }))
  .mutation(async ({ ctx, input }) => {
    return await ctx.db.category.update({
      where: {
        id: input.category
      },
      data: {
        users: { disconnect : [ {
          id: input.id
        } ] }
      }, 
    })
  }),
});
