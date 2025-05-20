import { pgTable, varchar, uuid } from "drizzle-orm/gel-core";

export const userSchema = pgTable("users", {
    id: uuid('id').primaryKey(),
    name: varchar('name').notNull(),
    bio: varchar('bio').notNull(),
});