# Staging-only SQL (project `mindurmind-staging`, ref `mebonbnkyxbtvnlkrcwf`)

These scripts are **not migrations**. The Supabase CLI never applies this
folder, and they must never be run on production.

- `01`/`02`: create objects that exist in production but that no migration
  creates:
  - the `quantum_documents` table (base columns);
  - the `learning_documents` table;
  - the `profiles.current_device_id` column.

  Found by comparing staging with production. Production drift to fix later
  with a proper "baseline" migration.
- `03`: 30-Day Program access for the `mindurmindlab+…@gmail.com` test
  accounts.
- `04`: pre-Phase-8 curriculum progress for the legacy test account (Days
  1–5, app-paced Day 1 checkpoint).

Test account logins (email + password at `/login`) are in the git-ignored
`.env.staging.local`.
