import "server-only";

import { loadEnvConfig } from "@next/env";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

type NeonClient = NeonQueryFunction<false, false>;
let client: NeonClient | undefined;

function getClient(): NeonClient {
  if (client) return client;

  loadEnvConfig(process.cwd());
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL must be a Neon Postgres connection string.");
  }

  client = neon(connectionString);
  return client;
}

// Keep route modules importable during Next.js build analysis, when secrets may
// not be configured. Initialize the client on the first actual query.
export const sql = new Proxy({} as Pick<NeonClient, "transaction">, {
  get(_target, property) {
    const activeClient = getClient();
    const value = Reflect.get(activeClient, property, activeClient);
    return typeof value === "function" ? value.bind(activeClient) : value;
  },
});
