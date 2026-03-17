import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import PortalWorkspace from "./portal-workspace";

export default async function PortalPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: projects } = await supabase
    .from("projects")
    .select(`
      id,
      title,
      slug,
      description,
      status,
      progress_percent,
      start_date,
      due_date,
      created_at,
      client_id,
      created_by,
      client:profiles!projects_client_id_fkey(id, full_name, email),
      created_by_profile:profiles!projects_created_by_fkey(id, full_name, email)
    `)
    .order("created_at", { ascending: false });

  const selectedProject = projects?.[0] ?? null;

  let columns: any[] = [];
  let tasks: any[] = [];
  let comments: any[] = [];
  let activities: any[] = [];
  let clients: any[] = [];
  let teamUsers: any[] = [];
  let dailyChecklist: any[] = [];

  if (selectedProject) {
    const [{ data: cols }, { data: projectTasks }, { data: taskComments }, { data: taskActivities }] =
      await Promise.all([
        supabase
          .from("project_columns")
          .select("*")
          .eq("project_id", selectedProject.id)
          .order("position", { ascending: true }),
        supabase
          .from("project_tasks")
          .select(`
            *,
            assigned:profiles!project_tasks_assigned_to_fkey(id, full_name, email),
            creator:profiles!project_tasks_created_by_fkey(id, full_name, email)
          `)
          .eq("project_id", selectedProject.id)
          .order("position", { ascending: true })
          .order("created_at", { ascending: false }),
        supabase
          .from("task_comments")
          .select(`
            *,
            author:profiles!task_comments_user_id_fkey(id, full_name, email)
          `)
          .eq("project_id", selectedProject.id)
          .order("created_at", { ascending: false })
          .limit(20),
        supabase
          .from("task_activity_logs")
          .select(`
            *,
            actor:profiles!task_activity_logs_user_id_fkey(id, full_name, email)
          `)
          .eq("project_id", selectedProject.id)
          .order("created_at", { ascending: false })
          .limit(20),
      ]);

    columns = cols ?? [];
    tasks = projectTasks ?? [];
    comments = taskComments ?? [];
    activities = taskActivities ?? [];
  }

  if (profile?.role === "admin" || profile?.role === "team") {
    const [{ data: clientRows }, { data: teamRows }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, email, role")
        .eq("role", "client")
        .order("created_at", { ascending: false }),
      supabase
        .from("profiles")
        .select("id, full_name, email, role")
        .in("role", ["admin", "team"])
        .order("full_name", { ascending: true }),
    ]);

    clients = clientRows ?? [];
    teamUsers = teamRows ?? [];
  }

  const { data: checklistRows } = await supabase
    .from("daily_checklist_items")
    .select("*")
    .eq("user_id", user.id)
    .eq("checklist_date", new Date().toISOString().slice(0, 10))
    .order("created_at", { ascending: true });

  dailyChecklist = checklistRows ?? [];

  return (
    <PortalWorkspace
      user={user}
      profile={profile}
      initialProjects={projects ?? []}
      initialSelectedProject={selectedProject}
      initialColumns={columns}
      initialTasks={tasks}
      initialComments={comments}
      initialActivities={activities}
      initialClients={clients}
      initialTeamUsers={teamUsers}
      initialDailyChecklist={dailyChecklist}
    />
  );
}