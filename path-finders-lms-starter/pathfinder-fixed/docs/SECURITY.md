# Security notes

- Passwords are handled by Supabase Auth rather than stored in application tables.
- Row Level Security must remain enabled on all sensitive tables.
- Student result queries must always rely on the authenticated user ID.
- Admin authorization must come from database-backed roles, not hidden frontend links.
- Never put Supabase service-role credentials into frontend JavaScript.
- Validate marks and user input server-side/database-side as well as in the UI.
- Add audit triggers/functions for mark changes before production.
- Private files should use protected storage paths and time-limited signed access rather than public URLs.
