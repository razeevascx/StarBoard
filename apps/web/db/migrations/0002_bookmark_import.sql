BEGIN;

ALTER TABLE public.bookmarks ADD COLUMN IF NOT EXISTS source_id text;
CREATE UNIQUE INDEX IF NOT EXISTS bookmarks_owner_source_key
  ON public.bookmarks (owner_id, source_id);

COMMIT;
