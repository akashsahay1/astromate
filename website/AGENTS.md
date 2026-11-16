# Architecture rules

- Keep action and premium accent colors in shared semantic tokens and a dedicated CTA button variant, separate from brand and admin colors, so presentation remains consistent without changing brand identity.
- Load external font stylesheets in the document head at app startup and include a Devanagari fallback in the shared sans-serif stack so Hindi renders consistently without CSS remote imports.

- Keep all images as files in the repo (src/assets, WebP for photos) and import them directly. Do not use Lovable Assets JSON pointers (/__l5e/...): the site is self-hosted at astromate.online and those URLs 404 there.
- Website data comes from the Astromate API (VITE_API_URL, default https://api.astromate.online/api; see src/hooks/useSupabaseData.ts). Do not add Supabase.
- Keep consultation topic labels and keyword matching in one shared definition and pass topic selection through URL search parameters so landing links and astrologer filtering stay aligned.
- Keep specialty options and bilingual matching aliases in one shared catalog used by search, banners and registration/admin selectors so options stay consistent without changing provider expertise.