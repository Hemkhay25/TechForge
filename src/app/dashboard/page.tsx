import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { signOutAction } from "@/app/dashboard/actions";

type Profile = { full_name: string | null; membership_plan_id: string };
type Enrollment = { id: string; learning_path_id: string; learning_paths: { title: string; slug: string } | null };

export const metadata = { title: "Your learning dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) return <section className="page-content"><div className="empty-state"><span aria-hidden="true">✳</span><h2>Your dashboard is waiting for setup</h2><p>Account and learning progress features require the TechForge Supabase configuration. Public learning content is available now.</p><Link className="button" href="/paths">Explore learning paths <span aria-hidden="true">↗</span></Link></div></section>;

  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/login");
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/login");

  const [profileResult, enrollmentResult, completedResult] = await Promise.all([
    supabase.from("profiles").select("full_name, membership_plan_id").eq("id", user.id).maybeSingle(),
    supabase.from("enrollments").select("id, learning_path_id, learning_paths!inner(title, slug)").eq("user_id", user.id).eq("status", "active").order("created_at", { ascending: false }),
    supabase.from("lesson_progress").select("lesson_id, lessons!inner(is_published, modules!inner(is_published, learning_paths!inner(is_published)))", { count: "exact", head: true }).eq("user_id", user.id).eq("is_complete", true).eq("lessons.is_published", true).eq("lessons.modules.is_published", true).eq("lessons.modules.learning_paths.is_published", true),
  ]);
  const queryError = profileResult.error ?? enrollmentResult.error ?? completedResult.error;
  if (queryError || !profileResult.data) return <section className="dashboard-wrap"><div className="notice-box warning" role="alert">We couldn&apos;t load your account information. Please refresh the page or try again later.</div><Link className="button button-quiet" href="/dashboard">Retry</Link></section>;
  const profile = profileResult.data as Profile;
  const { data: membershipPlan, error: membershipError } = await supabase.from("membership_plans").select("name").eq("id", profile.membership_plan_id).maybeSingle();
  if (membershipError || !membershipPlan) return <section className="dashboard-wrap"><div className="notice-box warning" role="alert">We couldn&apos;t load your membership details. Please refresh the page or try again later.</div><Link className="button button-quiet" href="/dashboard">Retry</Link></section>;
  const enrollments = (enrollmentResult.data ?? []) as unknown as Enrollment[];
  const firstName = profile.full_name?.trim().split(/\s+/)[0] || user.email?.split("@")[0] || "learner";

  return <section className="dashboard-wrap">
    <div className="dashboard-heading"><div><span className="section-kicker">Your learning space</span><h1>Welcome back, <em>{firstName}.</em></h1><p>Every small step adds up. Pick up where you left off or find something new to explore.</p></div><form action={signOutAction}><button className="button button-quiet" type="submit">Log out</button></form></div>
    <div className="dashboard-stats"><article><span>ACTIVE PATHS</span><strong>{enrollments.length}</strong><small>Your current learning plans</small></article><article><span>LESSONS COMPLETED</span><strong>{completedResult.count ?? 0}</strong><small>Saved to your account</small></article><article><span>MEMBERSHIP</span><strong>{membershipPlan.name}</strong><small>No paid plan configured</small></article></div>
    <div className="dashboard-section-heading"><div><span className="section-kicker">Keep the momentum</span><h2>Your learning paths</h2></div><Link href="/paths" className="text-link">Explore paths <span aria-hidden="true">↗</span></Link></div>
    {enrollments.length ? <div className="dashboard-paths">{enrollments.map((enrollment) => enrollment.learning_paths && <Link className="dashboard-path" href={`/paths/${enrollment.learning_paths.slug}`} key={enrollment.id}><span className="dashboard-path-icon" aria-hidden="true">↗</span><span><strong>{enrollment.learning_paths.title}</strong><small>Continue exploring your curriculum</small></span><span aria-hidden="true">→</span></Link>)}</div> : <div className="empty-state"><span aria-hidden="true">⌁</span><h2>Your first step is waiting</h2><p>You haven&apos;t enrolled in a learning path yet. Explore the available skills and choose where you&apos;d like to begin.</p><Link className="button" href="/paths">Explore learning paths <span aria-hidden="true">↗</span></Link></div>}
    <div className="dashboard-next"><div><span className="section-kicker">A practical next step</span><h2>Build something small.</h2><p>Apply a skill to a project idea and keep a record of what you learn along the way.</p></div><Link className="button button-dark" href="/projects">Find a project <span aria-hidden="true">↗</span></Link></div>
  </section>;
}
