import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

loadEnvConfig(process.cwd());

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be a Neon Postgres connection string.");
}

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL },
  schema: "./app/db/schema.ts",
  out: "./db/drizzle",
});
