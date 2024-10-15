// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const links = sqliteTable(
  "link",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    url: text("url").notNull(),
    key: text("key").unique(),
    name: text("name", { length: 256 }),
    views: int("views").notNull().default(0),
    createdBy: text("created_by"),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const newLinkSchema = createInsertSchema(links, {
  url: z.string().url().min(1),
  key: z.undefined(),
});
