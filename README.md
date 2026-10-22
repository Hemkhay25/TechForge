# TechForge

TechForge is a responsive technology-learning platform built with Next.js App Router, React, TypeScript, Tailwind CSS 4, and Supabase. Public skill guides, learning paths, and project ideas work from an original bundled content set. When a Supabase project is configured and migrated, those public directories read published records from PostgreSQL. Supabase Auth and contact-submission storage are wired but remain unavailable until configured.

## Run locally

On Windows, double-click [`Open-TechForge.cmd`](./Open-TechForge.cmd). It starts the development server in its own terminal, waits until both the health check and homepage respond, and then opens the browser. Keep the **TechForge server** terminal open while using the site. If it is closed or the computer shuts down, double-click the launcher again.

Alternatively, from the project folder run:

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Without Supabase credentials, the public pages use the bundled TechForge content. Account actions display a setup message instead of pretending to create or authenticate an account. The development server is a local development service, not a permanent public website; a public URL requires deploying the application to a hosting provider.

## Supabase setup

1. Create a Supabase project and copy its project URL and publishable/anon key into `.env.local` as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. Set `NEXT_PUBLIC_SITE_URL` to the local or deployed canonical URL.
3. In the Supabase SQL editor, run `supabase/migrations/202610200001_initial_schema.sql`, then `supabase/seed.sql`.
4. Configure Supabase Auth email templates and allowed redirect URLs, including `/auth/callback`.
5. Register the intended administrator account and verify its email. As a trusted project owner in the SQL editor, assign its role:

   ```sql
   insert into public.user_roles (user_id, role)
   select id, 'admin'
   from auth.users
   where email = 'your-admin-address@example.com'
     and email_confirmed_at is not null
   on conflict (user_id, role) do nothing;
   ```

   Replace the example address with the verified account. Do not add a public role selector or expose a service-role key to the browser.
6. Restart the application after changing environment variables.

Public directories use Supabase Row Level Security when configured. If configured database queries fail, the app surfaces an error rather than silently substituting bundled content. The seed creates original introductory content for the initial categories, skills, paths, modules, lesson summaries, and projects.

## Configuration and security

- `.env.example` documents public site/Supabase values and server-only placeholders. Never commit `.env.local`.
- `SUPABASE_SERVICE_ROLE_KEY`, `PAYSTACK_SECRET_KEY`, and `PAYSTACK_WEBHOOK_SECRET` are not used by the current implementation and must remain server-only.
- The database migration protects account records with RLS, restricts quiz answer keys, and separates payment event storage from browser access.
- The contact form stores submissions in Supabase only. It does not send email. Add a production-grade rate limiter and configure a verified email provider before public launch.
- Privacy and terms pages are explicitly drafts and need qualified legal review for the jurisdictions served.

## Current implementation status

Implemented: responsive public homepage; searchable/filterable skills and project directories; skill and learning-path detail pages; curriculum previews; pricing, about, contact, help, and draft policy pages; Supabase SSR session refresh; validated registration/login/password-reset actions; user-scoped dashboard queries; Supabase schema, RLS, and seed content; SEO metadata, sitemap, robots rules, and baseline security headers.

Not yet implemented: full onboarding and career recommendation flow; lesson player, persisted enrolment/completion mutations, and server-side quiz grading; admin UI and audited content-management mutations; Paystack checkout/verification/webhook lifecycle; outbound email; deployment configuration; automated unit, integration, and end-to-end test suites. Paid membership is not offered and no payments are collected. The administrator role can only be assigned through a trusted database operation.

## Checks

```powershell
npm run lint
npx tsc --noEmit
npm run build
```

Development and production builds use separate output folders (`.next-dev` and `.next`) to avoid one mode overwriting the other.

The database migration should also be applied to a disposable Supabase project and verified there before deployment. The bundled sample content is original starter material, not a claim of professional, legal, or career-placement advice.
