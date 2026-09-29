import { sql } from "drizzle-orm";
import { boolean, index, pgTable, text, timestamp, unique, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

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
  sourceId: text("source_id"),
  name: varchar("name", { length: 120 }).notNull(),
  description: varchar("description", { length: 500 }),
  color: varchar("color", { length: 32 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("collections_manual_owner_name_key").on(table.ownerId, table.name).where(sql`${table.sourceId} IS NULL`),
  uniqueIndex("collections_owner_source_key").on(table.ownerId, table.sourceId),
  index("collections_owner_created_at_idx").on(table.ownerId, table.createdAt),
]);

export const bookmarks = pgTable("bookmarks", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: uuid("owner_id").notNull().references(() => appUsers.id, { onDelete: "cascade" }),
  sourceId: text("source_id"),
  collectionId: uuid("collection_id").references(() => collections.id, { onDelete: "set null" }),
  url: text("url").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  isFavorite: boolean("is_favorite").default(false).notNull(),
  isUserEdited: boolean("is_user_edited").default(false).notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("bookmarks_owner_created_at_idx").on(table.ownerId, table.createdAt),
  index("bookmarks_collection_created_at_idx").on(table.collectionId, table.createdAt),
  unique("bookmarks_owner_source_key").on(table.ownerId, table.sourceId),
]);
