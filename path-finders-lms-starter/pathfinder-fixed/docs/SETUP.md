# Setup

1. Create a free Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`, then `supabase/seed.sql`, then `supabase/policies.sql`.
3. Put your Supabase project URL and anon key into `frontend/js/auth.js` during development. Never use a service-role key in browser code.
4. Complete Supabase Auth email/password configuration.
5. Host `frontend/` on a static host such as Vercel, Cloudflare Pages or GitHub Pages.
6. Add your real contact details and branding.

## Admin creation
Do not expose admin registration. Create an authenticated user through the Supabase dashboard, then assign the user's profile/admin role through a controlled admin process.

## Google Forms
Store the Google Form URL on an assessment record. Importing marks from Google Sheets should be implemented through a trusted server-side/Apps Script process, not by exposing a private sheet to students.
