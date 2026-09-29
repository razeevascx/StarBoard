BEGIN;

ALTER TABLE public.collections ADD COLUMN IF NOT EXISTS source_id text;
CREATE UNIQUE INDEX IF NOT EXISTS collections_manual_owner_name_key
  ON public.collections (owner_id, name) WHERE source_id IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS collections_owner_source_key
  ON public.collections (owner_id, source_id);
ALTER TABLE public.collections DROP CONSTRAINT IF EXISTS collections_owner_name_key;

COMMIT;
