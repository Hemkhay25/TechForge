create extension if not exists pgcrypto;

create type public.app_role as enum ('admin', 'learner');
create type public.content_access as enum ('free', 'premium');
create type public.enrollment_status as enum ('active', 'completed', 'cancelled');
create type public.subscription_status as enum ('pending', 'active', 'past_due', 'cancelled', 'expired');

create table public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text not null default '',
  currency char(3) not null default 'NGN',
  amount_minor bigint check (amount_minor is null or amount_minor >= 0),
  interval text check (interval is null or interval in ('month', 'year')),
  provider_plan_code text,
  entitlements jsonb not null default '[]'::jsonb,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (amount_minor is null or interval is not null or amount_minor = 0)
);

insert into public.membership_plans (code, name, description, amount_minor, is_active)
values ('free', 'TechForge Free', 'Public career guides, path previews, and project ideas.', 0, true)
on conflict (code) do nothing;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  country_code char(2),
  membership_plan_id uuid not null references public.membership_plans(id) on delete restrict,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  assigned_at timestamptz not null default now(),
  assigned_by uuid references auth.users(id) on delete set null,
  primary key (user_id, role)
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = (select auth.uid()) and role = 'admin'
  );
$$;

create table public.skill_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text not null default '',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.skill_categories(id) on delete restrict,
  slug text not null unique,
  title text not null,
  summary text not null,
  description text not null default '',
  difficulty text not null default 'beginner' check (difficulty in ('beginner', 'intermediate', 'advanced')),
  estimated_commitment text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.learning_paths (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  difficulty text not null default 'beginner' check (difficulty in ('beginner', 'intermediate', 'advanced')),
  estimated_duration text,
  access_level public.content_access not null default 'free',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.learning_path_skills (
  learning_path_id uuid not null references public.learning_paths(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  primary key (learning_path_id, skill_id)
);

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  learning_path_id uuid not null references public.learning_paths(id) on delete cascade,
  title text not null,
  description text not null default '',
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (learning_path_id, sort_order)
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  slug text not null,
  title text not null,
  summary text not null default '',
  content_markdown text not null default '',
  estimated_minutes integer check (estimated_minutes is null or estimated_minutes > 0),
  is_preview boolean not null default false,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (module_id, slug),
  unique (module_id, sort_order)
);

create table public.lesson_resources (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references public.lessons(id) on delete cascade,
  title text not null,
  provider text not null default '',
  url text not null,
  description text not null default '',
  cost_classification text check (cost_classification is null or cost_classification in ('free', 'paid', 'mixed', 'unknown')),
  difficulty text check (difficulty is null or difficulty in ('beginner', 'intermediate', 'advanced')),
  last_reviewed_at timestamptz,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  check (url ~ '^https://')
);

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  title text not null,
  instructions text not null,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null unique references public.lessons(id) on delete cascade,
  title text not null,
  pass_percentage smallint not null default 70 check (pass_percentage between 0 and 100),
  is_published boolean not null default false
);

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  prompt text not null,
  explanation text not null default '',
  sort_order integer not null default 0,
  unique (quiz_id, sort_order)
);

create table public.quiz_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  label text not null,
  sort_order integer not null default 0,
  unique (question_id, sort_order),
  unique (question_id, id)
);

create table public.quiz_answer_keys (
  question_id uuid primary key references public.quiz_questions(id) on delete cascade,
  option_id uuid not null,
  foreign key (question_id, option_id) references public.quiz_options(question_id, id) on delete cascade
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  learning_path_id uuid not null references public.learning_paths(id) on delete restrict,
  status public.enrollment_status not null default 'active',
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, learning_path_id)
);

create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  is_complete boolean not null default false,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id),
  check (is_complete or completed_at is null)
);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  score_percentage numeric(5,2) not null check (score_percentage between 0 and 100),
  answers jsonb not null,
  attempted_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category_id uuid references public.skill_categories(id) on delete set null,
  difficulty text not null default 'beginner' check (difficulty in ('beginner', 'intermediate', 'advanced')),
  description text not null,
  expected_outcome text not null default '',
  estimated_effort text,
  instructions text not null default '',
  required_skills text[] not null default '{}',
  learning_objectives text[] not null default '{}',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete restrict,
  submission_url text,
  notes text not null default '',
  submitted_at timestamptz not null default now(),
  admin_feedback text,
  reviewed_at timestamptz,
  unique (user_id, project_id),
  check (submission_url is null or submission_url ~ '^https://')
);

create table public.saved_skills (
  user_id uuid not null references auth.users(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, skill_id)
);

create table public.saved_resources (
  user_id uuid not null references auth.users(id) on delete cascade,
  resource_id uuid not null references public.lesson_resources(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, resource_id)
);

create table public.onboarding_responses (
  user_id uuid primary key references auth.users(id) on delete cascade,
  interests text[] not null default '{}',
  experience_level text check (experience_level is null or experience_level in ('beginner', 'intermediate', 'advanced')),
  primary_goal text,
  has_computer boolean,
  weekly_study_hours smallint check (weekly_study_hours is null or weekly_study_hours between 0 and 168),
  preferred_learning_styles text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  plan_id uuid not null references public.membership_plans(id) on delete restrict,
  provider text not null check (provider in ('paystack', 'manual')),
  provider_customer_code text,
  provider_subscription_code text,
  status public.subscription_status not null default 'pending',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  provider text not null check (provider = 'paystack'),
  provider_reference text not null unique,
  amount_minor bigint not null check (amount_minor >= 0),
  currency char(3) not null,
  status text not null check (status in ('initialized', 'success', 'failed', 'refunded')),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider = 'paystack'),
  provider_event_id text not null,
  event_type text not null,
  payload jsonb not null,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (provider, provider_event_id)
);

create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) between 3 and 254),
  subject text not null check (char_length(subject) between 3 and 160),
  message text not null check (char_length(message) between 10 and 5000),
  created_at timestamptz not null default now()
);

create table public.administrative_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.has_active_subscription()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.subscriptions
    where user_id = (select auth.uid())
      and status = 'active'
      and (current_period_end is null or current_period_end > now())
  );
$$;

create index skills_category_idx on public.skills(category_id, is_published);
create index paths_published_idx on public.learning_paths(is_published, access_level);
create index modules_path_order_idx on public.modules(learning_path_id, sort_order);
create index lessons_module_order_idx on public.lessons(module_id, sort_order);
create index lesson_progress_user_complete_idx on public.lesson_progress(user_id, is_complete);
create index enrollments_user_status_idx on public.enrollments(user_id, status);
create index subscriptions_user_status_idx on public.subscriptions(user_id, status);
create index payments_user_created_idx on public.payments(user_id, created_at desc);
create index contact_submissions_created_idx on public.contact_submissions(created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, membership_plan_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    (select id from public.membership_plans where code = 'free')
  );
  insert into public.user_roles (user_id, role) values (new.id, 'learner');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at before update on public.profiles for each row execute procedure public.touch_updated_at();
create trigger plans_touch_updated_at before update on public.membership_plans for each row execute procedure public.touch_updated_at();
create trigger skills_touch_updated_at before update on public.skills for each row execute procedure public.touch_updated_at();
create trigger paths_touch_updated_at before update on public.learning_paths for each row execute procedure public.touch_updated_at();
create trigger modules_touch_updated_at before update on public.modules for each row execute procedure public.touch_updated_at();
create trigger lessons_touch_updated_at before update on public.lessons for each row execute procedure public.touch_updated_at();
create trigger projects_touch_updated_at before update on public.projects for each row execute procedure public.touch_updated_at();
create trigger progress_touch_updated_at before update on public.lesson_progress for each row execute procedure public.touch_updated_at();
create trigger subscriptions_touch_updated_at before update on public.subscriptions for each row execute procedure public.touch_updated_at();

alter table public.membership_plans enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.skill_categories enable row level security;
alter table public.skills enable row level security;
alter table public.learning_paths enable row level security;
alter table public.learning_path_skills enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_resources enable row level security;
alter table public.exercises enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_options enable row level security;
alter table public.quiz_answer_keys enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.projects enable row level security;
alter table public.project_submissions enable row level security;
alter table public.saved_skills enable row level security;
alter table public.saved_resources enable row level security;
alter table public.onboarding_responses enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.payment_events enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.administrative_audit_logs enable row level security;

create policy "profiles_select_own_or_admin" on public.profiles for select to authenticated using (id = (select auth.uid()) or (select public.is_admin()));
create policy "profiles_update_own" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy "roles_select_own_or_admin" on public.user_roles for select to authenticated using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "categories_public_read" on public.skill_categories for select to anon, authenticated using (is_published or (select public.is_admin()));
create policy "skills_public_read" on public.skills for select to anon, authenticated using (is_published or (select public.is_admin()));
create policy "paths_public_read" on public.learning_paths for select to anon, authenticated using (is_published and (access_level = 'free' or (select public.has_active_subscription())) or (select public.is_admin()));
create policy "path_skills_read" on public.learning_path_skills for select to anon, authenticated using (exists (select 1 from public.learning_paths p where p.id = learning_path_id and ((p.is_published and (p.access_level = 'free' or (select public.has_active_subscription()))) or (select public.is_admin()))));
create policy "modules_public_read" on public.modules for select to anon, authenticated using (is_published and exists (select 1 from public.learning_paths p where p.id = learning_path_id and p.is_published and (p.access_level = 'free' or (select public.has_active_subscription()))) or (select public.is_admin()));
create policy "lessons_public_read" on public.lessons for select to anon, authenticated using (is_published and exists (select 1 from public.modules m join public.learning_paths p on p.id = m.learning_path_id where m.id = module_id and m.is_published and p.is_published and (p.access_level = 'free' or (select public.has_active_subscription()))) or (select public.is_admin()));
create policy "resources_public_read" on public.lesson_resources for select to anon, authenticated using (is_published and (lesson_id is null or exists (select 1 from public.lessons l join public.modules m on m.id = l.module_id join public.learning_paths p on p.id = m.learning_path_id where l.id = lesson_id and l.is_published and m.is_published and p.is_published and (p.access_level = 'free' or (select public.has_active_subscription())))) or (select public.is_admin()));
create policy "exercises_public_read" on public.exercises for select to anon, authenticated using (is_published and exists (select 1 from public.lessons l join public.modules m on m.id = l.module_id join public.learning_paths p on p.id = m.learning_path_id where l.id = lesson_id and l.is_published and m.is_published and p.is_published and (p.access_level = 'free' or (select public.has_active_subscription()))) or (select public.is_admin()));
create policy "quizzes_public_read" on public.quizzes for select to anon, authenticated using (is_published and exists (select 1 from public.lessons l join public.modules m on m.id = l.module_id join public.learning_paths p on p.id = m.learning_path_id where l.id = lesson_id and l.is_published and m.is_published and p.is_published and (p.access_level = 'free' or (select public.has_active_subscription()))) or (select public.is_admin()));
create policy "quiz_questions_public_read" on public.quiz_questions for select to authenticated using (exists (select 1 from public.quizzes q join public.lessons l on l.id = q.lesson_id join public.modules m on m.id = l.module_id join public.learning_paths p on p.id = m.learning_path_id where q.id = quiz_id and q.is_published and l.is_published and m.is_published and p.is_published and (p.access_level = 'free' or (select public.has_active_subscription()))));
create policy "quiz_options_public_read" on public.quiz_options for select to authenticated using (exists (select 1 from public.quiz_questions qq join public.quizzes q on q.id = qq.quiz_id join public.lessons l on l.id = q.lesson_id join public.modules m on m.id = l.module_id join public.learning_paths p on p.id = m.learning_path_id where qq.id = question_id and q.is_published and l.is_published and m.is_published and p.is_published and (p.access_level = 'free' or (select public.has_active_subscription()))));
create policy "quiz_keys_admin_only" on public.quiz_answer_keys for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "enrollments_select_own_or_admin" on public.enrollments for select to authenticated using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "enrollments_insert_own_published" on public.enrollments for insert to authenticated with check (user_id = (select auth.uid()) and exists (select 1 from public.learning_paths p where p.id = learning_path_id and p.is_published and (p.access_level = 'free' or (select public.has_active_subscription()))));
create policy "progress_select_own_or_admin" on public.lesson_progress for select to authenticated using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "progress_insert_own_enrolled" on public.lesson_progress for insert to authenticated with check (user_id = (select auth.uid()) and exists (select 1 from public.lessons l join public.modules m on m.id = l.module_id join public.learning_paths p on p.id = m.learning_path_id join public.enrollments e on e.learning_path_id = p.id where l.id = lesson_id and l.is_published and m.is_published and p.is_published and (p.access_level = 'free' or (select public.has_active_subscription())) and e.user_id = (select auth.uid()) and e.status = 'active'));
create policy "progress_update_own_enrolled" on public.lesson_progress for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and exists (select 1 from public.lessons l join public.modules m on m.id = l.module_id join public.learning_paths p on p.id = m.learning_path_id join public.enrollments e on e.learning_path_id = p.id where l.id = lesson_id and l.is_published and m.is_published and p.is_published and (p.access_level = 'free' or (select public.has_active_subscription())) and e.user_id = (select auth.uid()) and e.status = 'active'));
create policy "attempts_select_own_or_admin" on public.quiz_attempts for select to authenticated using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "projects_public_read" on public.projects for select to anon, authenticated using (is_published or (select public.is_admin()));
create policy "submissions_own_or_admin" on public.project_submissions for select to authenticated using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "submissions_insert_own" on public.project_submissions for insert to authenticated with check (user_id = (select auth.uid()) and exists (select 1 from public.projects p where p.id = project_id and p.is_published));
create policy "submissions_update_own" on public.project_submissions for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and exists (select 1 from public.projects p where p.id = project_id and p.is_published));
create policy "saved_skills_own" on public.saved_skills for all to authenticated using (user_id = (select auth.uid()) and exists (select 1 from public.skills s where s.id = skill_id and s.is_published)) with check (user_id = (select auth.uid()) and exists (select 1 from public.skills s where s.id = skill_id and s.is_published));
create policy "saved_resources_own" on public.saved_resources for all to authenticated using (user_id = (select auth.uid()) and exists (select 1 from public.lesson_resources r where r.id = resource_id and r.is_published)) with check (user_id = (select auth.uid()) and exists (select 1 from public.lesson_resources r where r.id = resource_id and r.is_published));
create policy "onboarding_own" on public.onboarding_responses for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "plans_public_read" on public.membership_plans for select to anon, authenticated using (is_active or (select public.is_admin()));
create policy "subscriptions_select_own_or_admin" on public.subscriptions for select to authenticated using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "payments_select_own_or_admin" on public.payments for select to authenticated using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "contact_insert_public" on public.contact_submissions for insert to anon, authenticated with check (true);
create policy "contact_select_admin" on public.contact_submissions for select to authenticated using ((select public.is_admin()));
create policy "audit_select_admin" on public.administrative_audit_logs for select to authenticated using ((select public.is_admin()));

revoke all on public.quiz_answer_keys from anon, authenticated;
grant select on public.quiz_answer_keys to authenticated;
revoke insert, update, delete on public.user_roles from anon, authenticated;
revoke update on public.profiles from authenticated;
grant update (full_name, country_code, onboarding_completed_at) on public.profiles to authenticated;
revoke update on public.enrollments from authenticated;
revoke update on public.project_submissions from authenticated;
grant update (submission_url, notes) on public.project_submissions to authenticated;
revoke insert, update, delete on public.subscriptions, public.payments, public.payment_events from anon, authenticated;
revoke insert, update, delete on public.administrative_audit_logs from anon, authenticated;

comment on table public.quiz_answer_keys is 'Private answer key; quiz evaluation must run in a trusted server-side function.';
comment on table public.payment_events is 'Write only from a verified, idempotent provider webhook using a server credential.';
comment on table public.administrative_audit_logs is 'Never include credentials, secrets, or unnecessary personal information in metadata.';
