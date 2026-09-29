BEGIN;

ALTER TABLE public.bookmarks ADD COLUMN IF NOT EXISTS og_image_url text;
ALTER TABLE public.bookmarks ADD COLUMN IF NOT EXISTS preview_fetched_at timestamptz;
ALTER TABLE public.bookmarks ADD COLUMN IF NOT EXISTS is_user_edited boolean NOT NULL DEFAULT false;

COMMIT;
