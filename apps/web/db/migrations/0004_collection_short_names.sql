UPDATE public.collections
SET name = regexp_replace(name, '^.* / ', ''), updated_at = now()
WHERE source_id IS NOT NULL AND name LIKE '% / %';
