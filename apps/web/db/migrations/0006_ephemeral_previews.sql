BEGIN;

ALTER TABLE public.bookmarks
  DROP COLUMN IF EXISTS favicon_url,
  DROP COLUMN IF EXISTS og_image_url,
  DROP COLUMN IF EXISTS preview_fetched_at;

COMMIT;
