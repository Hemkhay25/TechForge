import { categories as seedCategories, paths as seedPaths, projects as seedProjects, skills as seedSkills, type LearningPath, type Skill } from "@/lib/content";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type SkillRow = {
  slug: string;
  title: string;
  summary: string;
  difficulty: string;
  estimated_commitment: string | null;
  skill_categories: { name: string } | null;
};

type PathRow = {
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  estimated_duration: string | null;
  modules: { title: string; sort_order: number; lessons: { title: string; sort_order: number }[] }[];
  learning_path_skills: { skills: { skill_categories: { name: string } | null } | null }[];
};

type ProjectRow = {
  slug: string;
  title: string;
  difficulty: string;
  description: string;
  expected_outcome: string;
  estimated_effort: string | null;
  required_skills: string[];
  skill_categories: { name: string } | null;
};

type CategoryRow = { name: string; description: string };

const colors = ["mint", "violet", "coral", "blue", "amber", "pink"];
const icons: Record<string, string> = {
  "Software & Web": "</>",
  "Data & AI": "⌁",
  "Design & Creativity": "◒",
  "Cybersecurity & IT": "⌑",
  "Cloud & Infrastructure": "☁",
  "Digital Business": "↗",
};

function categoryColor(category: string) {
  const index = seedCategories.findIndex((item) => item.name === category);
  return colors[index < 0 ? 0 : index];
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export async function getPublishedSkills(): Promise<Skill[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return seedSkills;
  const { data, error } = await supabase
    .from("skills")
    .select("slug, title, summary, difficulty, estimated_commitment, skill_categories(name)")
    .eq("is_published", true)
    .order("title");
  if (error) throw new Error(`Unable to load published skills: ${error.message}`);
  return ((data ?? []) as unknown as SkillRow[]).map((item) => {
    const category = item.skill_categories?.name ?? "Technology";
    return {
      slug: item.slug,
      title: item.title,
      category,
      description: item.summary,
      level: titleCase(item.difficulty) as Skill["level"],
      commitment: item.estimated_commitment ?? "Flexible",
      icon: icons[category] ?? "✳",
      color: categoryColor(category),
    };
  });
}

export async function getPublishedPaths(): Promise<LearningPath[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return seedPaths;
  const { data, error } = await supabase
    .from("learning_paths")
    .select("slug, title, description, difficulty, estimated_duration, modules(title, sort_order, lessons(title, sort_order)), learning_path_skills(skills(skill_categories(name)))")
    .eq("is_published", true)
    .order("title");
  if (error) throw new Error(`Unable to load published learning paths: ${error.message}`);
  return ((data ?? []) as unknown as PathRow[]).map((item) => {
    const category = item.learning_path_skills[0]?.skills?.skill_categories?.name ?? "Technology";
    const modules = item.modules
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((module) => ({
        title: module.title,
        lessons: module.lessons.slice().sort((a, b) => a.sort_order - b.sort_order).map((lesson) => lesson.title),
      }));
    return {
      slug: item.slug,
      title: item.title,
      description: item.description,
      category,
      level: titleCase(item.difficulty),
      duration: item.estimated_duration ?? "Self-paced",
      lessons: modules.reduce((total, module) => total + module.lessons.length, 0),
      icon: icons[category] ?? "✳",
      color: categoryColor(category),
      modules,
    };
  });
}

export async function getPublishedProjects() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return seedProjects;
  const { data, error } = await supabase
    .from("projects")
    .select("slug, title, difficulty, description, expected_outcome, estimated_effort, required_skills, skill_categories(name)")
    .eq("is_published", true)
    .order("title");
  if (error) throw new Error(`Unable to load published projects: ${error.message}`);
  return ((data ?? []) as unknown as ProjectRow[]).map((item) => ({
    slug: item.slug,
    title: item.title,
    category: item.skill_categories?.name ?? "Technology",
    level: titleCase(item.difficulty),
    effort: item.estimated_effort ?? "Flexible",
    description: item.description,
    skills: item.required_skills,
    outcome: item.expected_outcome,
  }));
}

export async function getPublishedCategories() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return seedCategories;
  const { data, error } = await supabase
    .from("skill_categories")
    .select("name, description")
    .eq("is_published", true)
    .order("sort_order");
  if (error) throw new Error(`Unable to load published skill categories: ${error.message}`);
  return ((data ?? []) as CategoryRow[]).map((item) => ({
    name: item.name,
    count: item.description || "Explore this area",
    icon: icons[item.name] ?? "✳",
    color: categoryColor(item.name),
  }));
}
