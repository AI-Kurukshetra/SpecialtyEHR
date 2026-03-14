# Next.js + Supabase + shadcn/ui Starter

Minimal boilerplate with:

- Next.js App Router + TypeScript
- Supabase auth + database + SSR session refresh
- shadcn/ui base components
- Vercel-ready deployment

## 1) Install

```bash
npm install
cp .env.example .env.local
```

Set `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 2) Configure Supabase

1. Create a Supabase project.
2. In Authentication URL config:
   - Site URL: `http://localhost:3000`
   - Redirect URL: `http://localhost:3000/auth/callback`
3. Run SQL migrations in order:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_ehr_dashboard_seed.sql`
   - `supabase/migrations/0003_auth_roles.sql`
   - `supabase/migrations/0004_patient_management_module.sql`
   - `supabase/migrations/0005_promote_shreyash_admin.sql`
   - `supabase/migrations/0006_healthcare_core_entities.sql`
   - `supabase/migrations/0007_seed_healthcare_core_entities.sql`
   - `supabase/migrations/0008_seed_role_accounts.sql`

The second migration creates specialty EHR module tables and inserts realistic demo data so the dashboard is immediately presentable.
The third migration adds role-based authentication support (`doctor`, `nurse`, `receptionist`, `admin`).

## 3) Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## 4) Deploy on Vercel

1. Push repo to GitHub.
2. Import project in Vercel.
3. Add env vars in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. In Supabase auth settings, add your Vercel URL:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URL: `https://your-app.vercel.app/auth/callback`
