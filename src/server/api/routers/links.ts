import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { links, newLinkSchema } from "~/server/db/schema";
import urlMetadata from "url-metadata";
import { URLShortener } from "~/lib/utils";

export const linksRouter = createTRPCRouter({
  create: publicProcedure
    .input(newLinkSchema)
    .mutation(async ({ ctx, input }) => {
      const [newLink, metadata] = await Promise.allSettled([
        ctx.db
          .insert(links)
          .values({
            ...input,
            // Hardcoded value for page UI
            createdBy: "test-user",
          })
          .returning(),
        urlMetadata(input.url, {
          includeResponseBody: false,
        }),
      ]);

      if (newLink.status === "rejected") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to create link",
        });
      }

      try {
        const urlShortener = new URLShortener();
        // We know the link was created, so safely assume it's there
        const newId = newLink.value[0]!.id;
        const shortened = urlShortener.encode(newId);

        // If the meta has failed, we just use the default title
        const title =
          metadata.status === "fulfilled"
            ? (metadata.value.title as string)
            : "Untitled link";

        await ctx.db
          .update(links)
          .set({
            key: shortened,
            name: title,
          })
          .where(eq(links.id, newId))
          .execute();

        return { success: true, id: newId, key: shortened };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to build matching key",
          cause: error,
        });
      }
    }),
  view: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db
        .update(links)
        .set({ views: sql`${links.views} + 1` })
        .where(eq(links.id, input.id))
        .returning();
    }),
  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const link = await ctx.db.query.links.findFirst({
        where: (t, op) => op.eq(t.id, input.id),
      });

      return link;
    }),
  getMostVisited: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.links.findMany({
      orderBy: (t, op) => op.desc(t.views),
      limit: 100,
    });
  }),
  getMostRecent: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.links.findMany({
      // Assuming the user was the one who created the link and not the `seed.ts` file
      where: (t, op) => op.isNotNull(t.createdBy),
      orderBy: (t, op) => op.desc(t.createdAt),
      limit: 10,
    });
  }),
});
