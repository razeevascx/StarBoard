import { boolean, index, pgTable, text, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";

export const appUsers = pgTable("app_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email"),
  displayName: text("display_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const collections = pgTable("collections", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: uuid("owner_id").notNull().references(() => appUsers.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 120 }).notNull(),
  description: varchar("description", { length: 500 }),
  color: varchar("color", { length: 32 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  unique("collections_owner_name_key").on(table.ownerId, table.name),
  index("collections_owner_created_at_idx").on(table.ownerId, table.createdAt),
]);

export const bookmarks = pgTable("bookmarks", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: uuid("owner_id").notNull().references(() => appUsers.id, { onDelete: "cascade" }),
  collectionId: uuid("collection_id").references(() => collections.id, { onDelete: "set null" }),
  url: text("url").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  faviconUrl: text("favicon_url"),
  isFavorite: boolean("is_favorite").default(false).notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("bookmarks_owner_created_at_idx").on(table.ownerId, table.createdAt),
  index("bookmarks_collection_created_at_idx").on(table.collectionId, table.createdAt),
]);
