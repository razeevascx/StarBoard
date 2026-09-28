# Database migrations

`app/db/schema.ts` is the Drizzle declaration for the application tables.

Row-level security is intentionally kept in `migrations/0001_library.sql` because Drizzle Kit does not model or preserve RLS policies during `drizzle-kit push`. Apply the versioned SQL migration after using a schema push, and prefer versioned migrations for production changes.
