BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- The web server connects as the Neon owner role. It drops to this role for
-- every user request, so RLS is enforced even though migrations use an owner.
DO $$
BEGIN
  CREATE ROLE starboard_app NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  EXECUTE format('GRANT starboard_app TO %I', current_user);
END $$;

CREATE SCHEMA IF NOT EXISTS app;

CREATE OR REPLACE FUNCTION app.current_clerk_user_id()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.user_id', true), '');
$$;

CREATE TABLE IF NOT EXISTS public.app_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id text NOT NULL UNIQUE,
  email text,
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES public.app_users(id) ON DELETE CASCADE,
  name varchar(120) NOT NULL,
  description varchar(500),
  color varchar(32),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT collections_owner_name_key UNIQUE (owner_id, name)
);

CREATE TABLE IF NOT EXISTS public.bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES public.app_users(id) ON DELETE CASCADE,
  collection_id uuid REFERENCES public.collections(id) ON DELETE SET NULL,
  url text NOT NULL,
  title varchar(500) NOT NULL,
  description text,
  favicon_url text,
  is_favorite boolean NOT NULL DEFAULT false,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT bookmarks_url_not_empty CHECK (length(btrim(url)) > 0)
);

CREATE INDEX IF NOT EXISTS collections_owner_created_at_idx
  ON public.collections (owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS bookmarks_owner_created_at_idx
  ON public.bookmarks (owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS bookmarks_collection_created_at_idx
  ON public.bookmarks (collection_id, created_at DESC)
  WHERE deleted_at IS NULL;

ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_users FORCE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections FORCE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS app_users_self ON public.app_users;
CREATE POLICY app_users_self ON public.app_users
  USING (clerk_user_id = app.current_clerk_user_id())
  WITH CHECK (clerk_user_id = app.current_clerk_user_id());

DROP POLICY IF EXISTS collections_owner_only ON public.collections;
CREATE POLICY collections_owner_only ON public.collections
  USING (EXISTS (
    SELECT 1 FROM public.app_users users
    WHERE users.id = collections.owner_id
      AND users.clerk_user_id = app.current_clerk_user_id()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.app_users users
    WHERE users.id = collections.owner_id
      AND users.clerk_user_id = app.current_clerk_user_id()
  ));

DROP POLICY IF EXISTS bookmarks_owner_only ON public.bookmarks;
CREATE POLICY bookmarks_owner_only ON public.bookmarks
  USING (EXISTS (
    SELECT 1 FROM public.app_users users
    WHERE users.id = bookmarks.owner_id
      AND users.clerk_user_id = app.current_clerk_user_id()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.app_users users
    WHERE users.id = bookmarks.owner_id
      AND users.clerk_user_id = app.current_clerk_user_id()
  ));

GRANT USAGE ON SCHEMA public, app TO starboard_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_users, public.collections, public.bookmarks TO starboard_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO starboard_app;

COMMIT;
