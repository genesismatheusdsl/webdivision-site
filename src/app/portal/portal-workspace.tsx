"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import {
  Activity,
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  CheckSquare,
  ClipboardList,
  Clock3,
  Eye,
  FolderKanban,
  LayoutGrid,
  Loader2,
  LogOut,
  MessageSquare,
  MoreHorizontal,
  PauseCircle,
  Plus,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  User2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

type BasicUser = {
  id: string;
  email?: string | null;
};

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: "admin" | "team" | "client";
};

type ProjectPerson = {
  id: string;
  full_name: string | null;
  email: string | null;
};

type Project = {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  status: string;
  progress_percent: number;
  start_date: string | null;
  due_date: string | null;
  created_at: string;
  client_id: string;
  created_by: string | null;
  client?: ProjectPerson[] | null;
  created_by_profile?: ProjectPerson[] | null;
};

type Column = {
  id: string;
  project_id: string;
  name: string;
  slug: string | null;
  position: number;
  color: string | null;
};

type TaskPerson = {
  id: string;
  full_name: string | null;
  email: string | null;
};

type Task = {
  id: string;
  project_id: string;
  column_id: string | null;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  is_visible_to_client: boolean;
  assigned_to: string | null;
  created_by: string | null;
  assigned?: TaskPerson[] | TaskPerson | null;
  creator?: TaskPerson[] | TaskPerson | null;
};

type CommentAuthor = {
  full_name: string | null;
  email: string | null;
};

type Comment = {
  id: string;
  task_id: string;
  content: string;
  created_at: string;
  visibility: "publico" | "interno";
  author?: CommentAuthor[] | CommentAuthor | null;
};

type ActivityActor = {
  full_name: string | null;
  email: string | null;
};

type ActivityItem = {
  id: string;
  action: string;
  description: string | null;
  created_at: string;
  actor?: ActivityActor[] | ActivityActor | null;
};

type DailyChecklistItem = {
  id: string;
  title: string;
  is_done: boolean;
  checklist_date: string;
};

type SelectOptionUser = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
};

type ManagementTab = "client" | "team" | "project" | "task";

type LocalTaskChecklistItem = {
  id: string;
  title: string;
  done: boolean;
};

function firstRelationItem<T>(value?: T[] | T | null): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getPriorityClass(priority: string) {
  switch (priority) {
    case "urgente":
      return "border-red-200 bg-red-50 text-red-600";
    case "alta":
      return "border-orange-200 bg-orange-50 text-orange-600";
    case "media":
      return "border-sky-200 bg-sky-50 text-sky-600";
    case "baixa":
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

function getColumnStyle(slug?: string | null) {
  switch (slug) {
    case "backlog":
      return {
        wrap: "border-slate-200 bg-slate-50/90",
        top: "bg-slate-500",
        badge: "bg-slate-100 text-slate-700",
      };
    case "em_andamento":
      return {
        wrap: "border-sky-200 bg-sky-50/90",
        top: "bg-sky-500",
        badge: "bg-sky-100 text-sky-700",
      };
    case "em_revisao":
      return {
        wrap: "border-amber-200 bg-amber-50/90",
        top: "bg-amber-500",
        badge: "bg-amber-100 text-amber-700",
      };
    case "concluido":
      return {
        wrap: "border-emerald-200 bg-emerald-50/90",
        top: "bg-emerald-500",
        badge: "bg-emerald-100 text-emerald-700",
      };
    default:
      return {
        wrap: "border-slate-200 bg-white",
        top: "bg-cyan-500",
        badge: "bg-slate-100 text-slate-700",
      };
  }
}

function getProjectStatusMeta(status?: string | null) {
  switch (status) {
    case "concluido":
      return {
        label: "Concluído",
        className: "border-emerald-200 bg-emerald-50 text-emerald-700",
      };
    case "pausado":
      return {
        label: "Pausado",
        className: "border-amber-200 bg-amber-50 text-amber-700",
      };
    case "inativo":
      return {
        label: "Inativo",
        className: "border-slate-200 bg-slate-100 text-slate-600",
      };
    case "planejamento":
      return {
        label: "Planejamento",
        className: "border-sky-200 bg-sky-50 text-sky-700",
      };
    case "ativo":
    case "em_andamento":
      return {
        label: "Ativo",
        className: "border-cyan-200 bg-cyan-50 text-cyan-700",
      };
    default:
      return {
        label: status ? status.replaceAll("_", " ") : "Ativo",
        className: "border-slate-200 bg-slate-100 text-slate-700",
      };
  }
}

function getTaskProgressByColumns(tasks: Task[], columns: Column[]) {
  if (!tasks.length) return 0;

  const weights: Record<string, number> = {
    backlog: 0,
    em_andamento: 50,
    em_revisao: 80,
    concluido: 100,
  };

  const total = tasks.reduce((acc, task) => {
    const column = columns.find((c) => c.id === task.column_id);
    const slug = column?.slug || "backlog";
    return acc + (weights[slug] ?? 0);
  }, 0);

  return Math.round(total / tasks.length);
}

async function readApiResponse(response: Response) {
  const raw = await response.text();

  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    return { error: raw || "Resposta inválida do servidor." };
  }
}

export default function PortalWorkspace({
  user,
  profile,
  initialProjects,
  initialSelectedProject,
  initialColumns,
  initialTasks,
  initialComments,
  initialActivities,
  initialClients,
  initialTeamUsers,
  initialDailyChecklist,
}: {
  user: BasicUser;
  profile: Profile;
  initialProjects: Project[];
  initialSelectedProject: Project | null;
  initialColumns: Column[];
  initialTasks: Task[];
  initialComments: Comment[];
  initialActivities: ActivityItem[];
  initialClients: SelectOptionUser[];
  initialTeamUsers: SelectOptionUser[];
  initialDailyChecklist: DailyChecklistItem[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const projectMenuRef = useRef<HTMLDivElement | null>(null);

  const [projects, setProjects] = useState<Project[]>(initialProjects ?? []);
  const [selectedProject, setSelectedProject] = useState<Project | null>(initialSelectedProject);
  const [columns, setColumns] = useState<Column[]>(initialColumns ?? []);
  const [tasks, setTasks] = useState<Task[]>(initialTasks ?? []);
  const [comments, setComments] = useState<Comment[]>(initialComments ?? []);
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities ?? []);
  const [dailyChecklist, setDailyChecklist] = useState<DailyChecklistItem[]>(initialDailyChecklist ?? []);

  const [clients, setClients] = useState<SelectOptionUser[]>(initialClients ?? []);
  const [teamUsers, setTeamUsers] = useState<SelectOptionUser[]>(initialTeamUsers ?? []);

  const [loadingProject, setLoadingProject] = useState(false);
  const [loadingPeople, setLoadingPeople] = useState(false);
  const [refreshingAll, setRefreshingAll] = useState(false);
  const [movingTaskId, setMovingTaskId] = useState<string | null>(null);
  const [creatingProject, setCreatingProject] = useState(false);
  const [creatingTask, setCreatingTask] = useState(false);
  const [creatingChecklist, setCreatingChecklist] = useState(false);
  const [savingComment, setSavingComment] = useState(false);
  const [creatingClient, setCreatingClient] = useState(false);
  const [creatingTeamUser, setCreatingTeamUser] = useState(false);
  const [changingProjectActionId, setChangingProjectActionId] = useState<string | null>(null);
  const [openProjectMenuId, setOpenProjectMenuId] = useState<string | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [carryingOverChecklist, setCarryingOverChecklist] = useState(false);

  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [managementTab, setManagementTab] = useState<ManagementTab>("client");

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [newTaskChecklistTitle, setNewTaskChecklistTitle] = useState("");
  const [taskChecklists, setTaskChecklists] = useState<Record<string, LocalTaskChecklistItem[]>>({});

  const [selectedChecklistDate, setSelectedChecklistDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [clientForm, setClientForm] = useState({
    full_name: "",
    email: "",
  });

  const [teamForm, setTeamForm] = useState({
    full_name: "",
    email: "",
    role: "team",
  });

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    client_id: initialClients?.[0]?.id ?? "",
    due_date: "",
  });

  const [taskForm, setTaskForm] = useState({
    project_id: initialSelectedProject?.id ?? "",
    title: "",
    description: "",
    assigned_to: "",
    priority: "media",
    due_date: "",
    column_id: initialColumns?.[0]?.id ?? "",
    is_visible_to_client: true,
  });

  const [commentForm, setCommentForm] = useState({
    task_id: "",
    content: "",
    visibility: "publico" as "publico" | "interno",
  });

  const [checklistTitle, setChecklistTitle] = useState("");

  const groupedTasks = useMemo(() => {
    return columns.map((column) => ({
      ...column,
      tasks: tasks.filter((task) => task.column_id === column.id),
    }));
  }, [columns, tasks]);

  const commentsByTask = useMemo(() => {
    const map: Record<string, Comment[]> = {};
    for (const comment of comments) {
      if (!map[comment.task_id]) map[comment.task_id] = [];
      map[comment.task_id].push(comment);
    }
    return map;
  }, [comments]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "concluido").length;
  const pendingTasks = tasks.filter((task) => task.status !== "concluido").length;
  const progressPercentage = getTaskProgressByColumns(tasks, columns);

  const selectedTaskComments = selectedTask ? commentsByTask[selectedTask.id] ?? [] : [];

  function showError(message: string) {
    setErrorMessage(message);
    setFeedback(null);
  }

  function showSuccess(message: string) {
    setFeedback(message);
    setErrorMessage(null);
  }

  function getTaskChecklist(taskId: string) {
    return taskChecklists[taskId] ?? [];
  }

  function setTaskChecklist(taskId: string, items: LocalTaskChecklistItem[]) {
    setTaskChecklists((prev) => ({
      ...prev,
      [taskId]: items,
    }));
  }

  function toggleTaskChecklist(taskId: string, itemId: string) {
    const items = getTaskChecklist(taskId).map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item
    );
    setTaskChecklist(taskId, items);
  }

  function addTaskChecklistItem(taskId: string) {
    if (!newTaskChecklistTitle.trim()) return;

    const items = getTaskChecklist(taskId);
    setTaskChecklist(taskId, [
      ...items,
      {
        id: crypto.randomUUID(),
        title: newTaskChecklistTitle.trim(),
        done: false,
      },
    ]);
    setNewTaskChecklistTitle("");
  }

  function openTaskModal(task: Task) {
    setSelectedTask(task);
    setTaskModalOpen(true);
    setCommentForm((prev) => ({
      ...prev,
      task_id: task.id,
    }));
  }

  function closeTaskModal() {
    setTaskModalOpen(false);
    setSelectedTask(null);
    setNewTaskChecklistTitle("");
  }

  async function refreshPeopleOptions() {
    setLoadingPeople(true);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, role")
        .in("role", ["client", "team", "admin"])
        .order("full_name", { ascending: true });

      if (error) throw error;

      const people = (data ?? []) as SelectOptionUser[];
      const nextClients = people.filter((item) => item.role === "client");
      const nextTeamUsers = people.filter((item) => item.role === "team" || item.role === "admin");

      setClients(nextClients);
      setTeamUsers(nextTeamUsers);

      setProjectForm((prev) => ({
        ...prev,
        client_id:
          prev.client_id && nextClients.some((client) => client.id === prev.client_id)
            ? prev.client_id
            : nextClients[0]?.id ?? "",
      }));

      setTaskForm((prev) => ({
        ...prev,
        assigned_to:
          prev.assigned_to && nextTeamUsers.some((member) => member.id === prev.assigned_to)
            ? prev.assigned_to
            : "",
      }));
    } catch (error: any) {
      showError(`Erro ao carregar clientes e equipe: ${error?.message || "erro desconhecido"}`);
    } finally {
      setLoadingPeople(false);
    }
  }

  async function syncProjectProgress(projectId: string, nextTasks?: Task[], nextColumns?: Column[]) {
    const safeTasks = nextTasks ?? tasks;
    const safeColumns = nextColumns ?? columns;
    const nextProgress = getTaskProgressByColumns(safeTasks, safeColumns);

    try {
      await supabase
        .from("projects")
        .update({ progress_percent: nextProgress })
        .eq("id", projectId);

      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId ? { ...project, progress_percent: nextProgress } : project
        )
      );

      setSelectedProject((prev) =>
        prev?.id === projectId ? { ...prev, progress_percent: nextProgress } : prev
      );
    } catch {}
  }

  async function refreshProjectsAndSelected(projectId?: string) {
    const { data: freshProjects, error } = await supabase
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

    if (error) {
      showError(`Erro ao atualizar projetos: ${error.message}`);
      return;
    }

    const nextProjects = (freshProjects ?? []) as Project[];
    setProjects(nextProjects);

    const nextProject =
      nextProjects.find((item) => item.id === (projectId ?? selectedProject?.id)) ??
      nextProjects[0] ??
      null;

    setSelectedProject(nextProject);

    setTaskForm((prev) => ({
      ...prev,
      project_id: nextProject?.id ?? "",
    }));

    if (nextProject) {
      await loadProjectBundle(nextProject.id);
    } else {
      setColumns([]);
      setTasks([]);
      setComments([]);
      setActivities([]);
      setTaskForm((prev) => ({ ...prev, column_id: "" }));
      setCommentForm((prev) => ({ ...prev, task_id: "" }));
    }
  }

  async function loadProjectBundle(projectId: string) {
    setLoadingProject(true);

    try {
      const [
        { data: cols, error: colsError },
        { data: taskRows, error: tasksError },
        { data: commentRows, error: commentsError },
        { data: activityRows, error: activityError },
      ] = await Promise.all([
        supabase
          .from("project_columns")
          .select("*")
          .eq("project_id", projectId)
          .order("position", { ascending: true }),
        supabase
          .from("project_tasks")
          .select(`
            *,
            assigned:profiles!project_tasks_assigned_to_fkey(id, full_name, email),
            creator:profiles!project_tasks_created_by_fkey(id, full_name, email)
          `)
          .eq("project_id", projectId)
          .order("position", { ascending: true })
          .order("created_at", { ascending: false }),
        supabase
          .from("task_comments")
          .select(`
            *,
            author:profiles!task_comments_user_id_fkey(id, full_name, email)
          `)
          .eq("project_id", projectId)
          .order("created_at", { ascending: false })
          .limit(100),
        supabase
          .from("task_activity_logs")
          .select(`
            *,
            actor:profiles!task_activity_logs_user_id_fkey(id, full_name, email)
          `)
          .eq("project_id", projectId)
          .order("created_at", { ascending: false })
          .limit(20),
      ]);

      if (colsError) throw colsError;
      if (tasksError) throw tasksError;
      if (commentsError) throw commentsError;
      if (activityError) throw activityError;

      const nextColumns = (cols ?? []) as Column[];
      const nextTasks = (taskRows ?? []) as Task[];
      const nextComments = (commentRows ?? []) as Comment[];
      const nextActivities = (activityRows ?? []) as ActivityItem[];

      setColumns(nextColumns);
      setTasks(nextTasks);
      setComments(nextComments);
      setActivities(nextActivities);

      setTaskForm((prev) => ({
        ...prev,
        project_id: projectId,
        column_id:
          prev.column_id && nextColumns.some((col) => col.id === prev.column_id)
            ? prev.column_id
            : nextColumns[0]?.id ?? "",
      }));

      setCommentForm((prev) => ({
        ...prev,
        task_id:
          prev.task_id && nextTasks.some((task) => task.id === prev.task_id)
            ? prev.task_id
            : nextTasks[0]?.id ?? "",
      }));

      await syncProjectProgress(projectId, nextTasks, nextColumns);
    } catch (error: any) {
      showError(`Erro ao carregar projeto: ${error?.message || "erro desconhecido"}`);
      setColumns([]);
      setTasks([]);
      setComments([]);
      setActivities([]);
      setTaskForm((prev) => ({ ...prev, column_id: "" }));
    } finally {
      setLoadingProject(false);
    }
  }

  async function handleRefreshAll() {
    setRefreshingAll(true);
    setErrorMessage(null);

    try {
      await Promise.all([
        refreshPeopleOptions(),
        refreshProjectsAndSelected(),
        refreshChecklist(selectedChecklistDate),
      ]);
      showSuccess("Dados atualizados.");
    } finally {
      setRefreshingAll(false);
    }
  }

  async function handleSelectProject(projectId: string) {
    const project = projects.find((item) => item.id === projectId) ?? null;
    setSelectedProject(project);
    setTaskForm((prev) => ({ ...prev, project_id: projectId }));
    await loadProjectBundle(projectId);
  }

  async function handleTaskProjectChange(projectId: string) {
    setTaskForm((prev) => ({
      ...prev,
      project_id: projectId,
      column_id: "",
    }));

    if (!projectId) {
      setSelectedProject(null);
      setColumns([]);
      setTasks([]);
      setComments([]);
      setActivities([]);
      return;
    }

    const project = projects.find((item) => item.id === projectId) ?? null;
    setSelectedProject(project);
    await loadProjectBundle(projectId);
  }

  function mapColumnToTaskStatus(slug?: string | null) {
    if (!slug) return "backlog";
    if (slug === "backlog" || slug === "criado") return "backlog";
    if (slug === "em_andamento") return "em_andamento";
    if (slug === "em_revisao") return "em_revisao";
    if (slug === "aguardando_cliente" || slug === "depende_de_outro" || slug === "parado") {
      return "aguardando_cliente";
    }
    if (slug === "concluido") return "concluido";
    return "em_andamento";
  }

  async function createDefaultColumns(projectId: string) {
    const defaultColumns = [
      { project_id: projectId, name: "Backlog", slug: "backlog", position: 0, color: "#64748b" },
      { project_id: projectId, name: "Em andamento", slug: "em_andamento", position: 1, color: "#38bdf8" },
      { project_id: projectId, name: "Em revisão", slug: "em_revisao", position: 2, color: "#f59e0b" },
      { project_id: projectId, name: "Concluído", slug: "concluido", position: 3, color: "#34d399" },
    ];

    const { error } = await supabase.from("project_columns").insert(defaultColumns);
    if (error) throw error;
  }

  async function handleCreateClient(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setFeedback(null);

    if (!clientForm.full_name.trim()) {
      showError("Informe o nome do cliente.");
      return;
    }

    if (!clientForm.email.trim()) {
      showError("Informe o e-mail do cliente.");
      return;
    }

    setCreatingClient(true);

    try {
      const response = await fetch("/api/portal/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: clientForm.full_name.trim(),
          email: clientForm.email.trim().toLowerCase(),
          role: "client",
        }),
      });

      const result = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(result?.error || "Erro ao criar cliente.");
      }

      setClientForm({ full_name: "", email: "" });
      await refreshPeopleOptions();
      setManagementTab("project");

      showSuccess(
        `Cliente criado com sucesso. ${
          result?.tempPassword ? "Conta criada no Auth e perfil vinculado corretamente." : ""
        }`
      );
    } catch (error: any) {
      showError(`Erro ao criar cliente: ${error?.message || "erro desconhecido"}`);
    } finally {
      setCreatingClient(false);
    }
  }

  async function handleCreateTeamUser(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setFeedback(null);

    if (!teamForm.full_name.trim()) {
      showError("Informe o nome do membro da equipe.");
      return;
    }

    if (!teamForm.email.trim()) {
      showError("Informe o e-mail do membro da equipe.");
      return;
    }

    setCreatingTeamUser(true);

    try {
      const response = await fetch("/api/portal/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: teamForm.full_name.trim(),
          email: teamForm.email.trim().toLowerCase(),
          role: teamForm.role as "team" | "admin",
        }),
      });

      const result = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(result?.error || "Erro ao criar equipe.");
      }

      setTeamForm({
        full_name: "",
        email: "",
        role: "team",
      });

      await refreshPeopleOptions();
      setManagementTab("task");

      showSuccess(
        `Membro da equipe criado com sucesso. ${
          result?.tempPassword ? "Conta criada no Auth e perfil vinculado corretamente." : ""
        }`
      );
    } catch (error: any) {
      showError(`Erro ao criar equipe: ${error?.message || "erro desconhecido"}`);
    } finally {
      setCreatingTeamUser(false);
    }
  }

  async function handleMoveTask(taskId: string, destinationColumnId: string) {
    const destinationColumn = columns.find((item) => item.id === destinationColumnId);
    if (!destinationColumn) return;

    setMovingTaskId(taskId);

    const { error } = await supabase
      .from("project_tasks")
      .update({
        column_id: destinationColumn.id,
        status: mapColumnToTaskStatus(destinationColumn.slug),
      })
      .eq("id", taskId);

    setMovingTaskId(null);

    if (error) {
      showError(`Erro ao mover tarefa: ${error.message}`);
      return;
    }

    if (selectedProject) {
      showSuccess("Tarefa movida com sucesso.");
      await loadProjectBundle(selectedProject.id);
    }
  }

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setFeedback(null);

    if (!projectForm.title.trim()) {
      showError("Informe o nome do projeto.");
      return;
    }

    if (!projectForm.client_id) {
      showError("Selecione um cliente para criar o projeto.");
      return;
    }

    setCreatingProject(true);

    try {
      const slug = slugify(projectForm.title);

      const { data, error } = await supabase
        .from("projects")
        .insert({
          title: projectForm.title.trim(),
          description: projectForm.description.trim() || null,
          client_id: projectForm.client_id,
          slug: `${slug}-${Date.now()}`,
          due_date: projectForm.due_date || null,
          created_by: user.id,
          status: "planejamento",
          progress_percent: 0,
        })
        .select()
        .single();

      if (error) throw error;
      if (!data?.id) throw new Error("Projeto criado sem ID retornado.");

      await createDefaultColumns(data.id);

      setProjectForm({
        title: "",
        description: "",
        client_id: clients[0]?.id ?? "",
        due_date: "",
      });

      await refreshProjectsAndSelected(data.id);
      setTaskForm((prev) => ({
        ...prev,
        project_id: data.id,
      }));
      setManagementTab("task");
      showSuccess("Projeto criado com sucesso. Agora você já pode escolher a coluna do kanban.");
    } catch (error: any) {
      showError(`Erro ao criar projeto: ${error?.message || "erro desconhecido"}`);
    } finally {
      setCreatingProject(false);
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setFeedback(null);

    if (!selectedProject) {
      showError("Selecione um projeto antes de criar uma tarefa.");
      return;
    }

    if (!taskForm.title.trim()) {
      showError("Informe o título da tarefa.");
      return;
    }

    if (!taskForm.column_id) {
      showError("Selecione uma coluna do kanban para a tarefa.");
      return;
    }

    setCreatingTask(true);

    try {
      const currentColumn = columns.find((item) => item.id === taskForm.column_id);

      const { error } = await supabase.from("project_tasks").insert({
        project_id: selectedProject.id,
        column_id: taskForm.column_id,
        title: taskForm.title.trim(),
        description: taskForm.description.trim() || null,
        assigned_to: taskForm.assigned_to || null,
        created_by: user.id,
        priority: taskForm.priority,
        due_date: taskForm.due_date || null,
        is_visible_to_client: taskForm.is_visible_to_client,
        status: mapColumnToTaskStatus(currentColumn?.slug),
      });

      if (error) throw error;

      setTaskForm((prev) => ({
        ...prev,
        title: "",
        description: "",
        assigned_to: "",
        due_date: "",
        column_id: columns[0]?.id ?? "",
      }));

      await loadProjectBundle(selectedProject.id);
      showSuccess("Tarefa criada com sucesso.");
    } catch (error: any) {
      showError(`Erro ao criar tarefa: ${error?.message || "erro desconhecido"}`);
    } finally {
      setCreatingTask(false);
    }
  }

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setFeedback(null);

    if (!selectedProject) {
      showError("Selecione um projeto antes de comentar.");
      return;
    }

    if (!commentForm.task_id) {
      showError("Selecione uma tarefa para comentar.");
      return;
    }

    if (!commentForm.content.trim()) {
      showError("Digite um comentário.");
      return;
    }

    setSavingComment(true);

    try {
      const { error } = await supabase.from("task_comments").insert({
        task_id: commentForm.task_id,
        project_id: selectedProject.id,
        user_id: user.id,
        content: commentForm.content.trim(),
        visibility: commentForm.visibility,
      });

      if (error) throw error;

      setCommentForm((prev) => ({ ...prev, content: "" }));
      await loadProjectBundle(selectedProject.id);
      showSuccess("Comentário adicionado com sucesso.");
    } catch (error: any) {
      showError(`Erro ao adicionar comentário: ${error?.message || "erro desconhecido"}`);
    } finally {
      setSavingComment(false);
    }
  }

  async function handleAddChecklistItem(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setFeedback(null);

    if (!checklistTitle.trim()) {
      showError("Digite um item para o checklist.");
      return;
    }

    setCreatingChecklist(true);

    try {
      const { error } = await supabase.from("daily_checklist_items").insert({
        user_id: user.id,
        title: checklistTitle.trim(),
        checklist_date: selectedChecklistDate,
      });

      if (error) throw error;

      setChecklistTitle("");
      await refreshChecklist(selectedChecklistDate);
      showSuccess("Item adicionado no checklist.");
    } catch (error: any) {
      showError(`Erro ao adicionar checklist: ${error?.message || "erro desconhecido"}`);
    } finally {
      setCreatingChecklist(false);
    }
  }

  async function refreshChecklist(date = selectedChecklistDate) {
    const { data, error } = await supabase
      .from("daily_checklist_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("checklist_date", date)
      .order("created_at", { ascending: true });

    if (error) {
      showError(`Erro ao atualizar checklist: ${error.message}`);
      return;
    }

    setDailyChecklist((data ?? []) as DailyChecklistItem[]);
  }

  async function carryOverChecklistFromPreviousDay() {
    setCarryingOverChecklist(true);
    setErrorMessage(null);
    setFeedback(null);

    try {
      const baseDate = new Date(`${selectedChecklistDate}T12:00:00`);
      baseDate.setDate(baseDate.getDate() - 1);
      const previousDate = baseDate.toISOString().slice(0, 10);

      const { data: previousItems, error: previousError } = await supabase
        .from("daily_checklist_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("checklist_date", previousDate)
        .eq("is_done", false);

      if (previousError) throw previousError;

      if (!previousItems || previousItems.length === 0) {
        showSuccess("Não há pendências no dia anterior para puxar.");
        return;
      }

      const { data: currentItems, error: currentError } = await supabase
        .from("daily_checklist_items")
        .select("title")
        .eq("user_id", user.id)
        .eq("checklist_date", selectedChecklistDate);

      if (currentError) throw currentError;

      const currentTitles = new Set((currentItems ?? []).map((item: any) => item.title.trim().toLowerCase()));

      const itemsToInsert = previousItems
        .filter((item) => !currentTitles.has(item.title.trim().toLowerCase()))
        .map((item) => ({
          user_id: user.id,
          title: item.title,
          checklist_date: selectedChecklistDate,
          is_done: false,
        }));

      if (itemsToInsert.length === 0) {
        showSuccess("As pendências do dia anterior já foram puxadas.");
        return;
      }

      const { error: insertError } = await supabase.from("daily_checklist_items").insert(itemsToInsert);
      if (insertError) throw insertError;

      await refreshChecklist(selectedChecklistDate);
      showSuccess("Pendências do dia anterior adicionadas com sucesso.");
    } catch (error: any) {
      showError(`Erro ao puxar pendências: ${error?.message || "erro desconhecido"}`);
    } finally {
      setCarryingOverChecklist(false);
    }
  }

  async function toggleChecklistItem(id: string, nextValue: boolean) {
    const { error } = await supabase
      .from("daily_checklist_items")
      .update({ is_done: nextValue })
      .eq("id", id);

    if (error) {
      showError(`Erro ao atualizar checklist: ${error.message}`);
      return;
    }

    await refreshChecklist(selectedChecklistDate);
  }

  async function handleProjectStatusChange(projectId: string, status: string) {
    setChangingProjectActionId(projectId);
    setOpenProjectMenuId(null);
    setErrorMessage(null);
    setFeedback(null);

    try {
      const payload: Record<string, any> = { status };

      if (status === "concluido") {
        payload.progress_percent = 100;
      }

      const { error } = await supabase.from("projects").update(payload).eq("id", projectId);

      if (error) throw error;

      await refreshProjectsAndSelected(projectId);
      showSuccess(`Projeto atualizado para "${status.replaceAll("_", " ")}" com sucesso.`);
    } catch (error: any) {
      showError(`Erro ao atualizar projeto: ${error?.message || "erro desconhecido"}`);
    } finally {
      setChangingProjectActionId(null);
    }
  }

  async function handleDeleteProject(projectId: string) {
    setDeleteProjectId(projectId);
    setOpenProjectMenuId(null);
  }

  async function confirmDeleteProject() {
    if (!deleteProjectId) return;

    const projectId = deleteProjectId;
    setChangingProjectActionId(projectId);
    setDeleteProjectId(null);
    setErrorMessage(null);
    setFeedback(null);

    try {
      const taskIds = tasks.filter((task) => task.project_id === projectId).map((task) => task.id);

      if (taskIds.length > 0) {
        const { error: checklistTasksDeleteError } = await supabase
          .from("task_comments")
          .delete()
          .in("task_id", taskIds);

        if (checklistTasksDeleteError) {
          throw checklistTasksDeleteError;
        }
      }

      const { error: commentsError } = await supabase
        .from("task_comments")
        .delete()
        .eq("project_id", projectId);

      if (commentsError) throw commentsError;

      const { error: activitiesError } = await supabase
        .from("task_activity_logs")
        .delete()
        .eq("project_id", projectId);

      if (activitiesError) throw activitiesError;

      const { error: tasksError } = await supabase
        .from("project_tasks")
        .delete()
        .eq("project_id", projectId);

      if (tasksError) throw tasksError;

      const { error: columnsError } = await supabase
        .from("project_columns")
        .delete()
        .eq("project_id", projectId);

      if (columnsError) throw columnsError;

      const { error: projectError } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (projectError) throw projectError;

      const remainingProjects = projects.filter((project) => project.id !== projectId);
      const nextProjectId =
        selectedProject?.id === projectId ? remainingProjects[0]?.id : selectedProject?.id;

      await refreshProjectsAndSelected(nextProjectId);

      showSuccess("Projeto excluído com sucesso.");
    } catch (error: any) {
      showError(`Erro ao excluir projeto: ${error?.message || "erro desconhecido"}`);
    } finally {
      setChangingProjectActionId(null);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  useEffect(() => {
    void refreshPeopleOptions();
    void refreshProjectsAndSelected();
  }, []);

  useEffect(() => {
    void refreshChecklist(selectedChecklistDate);
  }, [selectedChecklistDate]);

  useEffect(() => {
    const saved = localStorage.getItem("portal-task-checklists");
    if (saved) {
      try {
        setTaskChecklists(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("portal-task-checklists", JSON.stringify(taskChecklists));
  }, [taskChecklists]);

  useEffect(() => {
    if (!selectedProject && projects.length > 0) {
      const firstProject = projects[0];
      setSelectedProject(firstProject);
      setTaskForm((prev) => ({ ...prev, project_id: firstProject.id }));
      void loadProjectBundle(firstProject.id);
    }
  }, [projects, selectedProject]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (projectMenuRef.current && !projectMenuRef.current.contains(event.target as Node)) {
        setOpenProjectMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isManager = profile.role === "admin" || profile.role === "team";
  const selectedClient = firstRelationItem(selectedProject?.client);
  const selectedCreator = firstRelationItem(selectedProject?.created_by_profile);
  const isTodayChecklist = selectedChecklistDate === new Date().toISOString().slice(0, 10);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef6ff_0%,#f9fbff_28%,#f5f7fb_100%)] text-slate-900">
      <div className="mx-auto max-w-[1720px] px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-4 space-y-2">
          {errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
              {errorMessage}
            </div>
          ) : null}

          {feedback ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm">
              {feedback}
            </div>
          ) : null}
        </div>

        <div className="mb-5 flex flex-wrap gap-3">
          <button
            onClick={handleRefreshAll}
            disabled={refreshingAll}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
          >
            {refreshingAll ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
            Recarregar dados do portal
          </button>

          <MiniStat label="Clientes" value={clients.length} />
          <MiniStat label="Equipe" value={teamUsers.length} />
          <MiniStat label="Projetos" value={projects.length} />
          <MiniStat label="Tarefas" value={tasks.length} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[300px_1fr_350px]">
          <aside className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-sky-600">
                    Usuário logado
                  </div>
                  <h2 className="mt-2 text-xl font-black text-slate-900">
                    {profile.full_name || "Usuário"}
                  </h2>
                  <p className="text-sm text-slate-500">{profile.email}</p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                  <User2 size={22} />
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Perfil: <span className="font-bold uppercase text-slate-900">{profile.role}</span>
              </div>

              <button
                onClick={handleLogout}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Projetos</h3>
                  <p className="text-sm text-slate-500">Selecione um projeto</p>
                </div>
                <FolderKanban className="text-sky-600" size={20} />
              </div>

              <div ref={projectMenuRef} className="space-y-3">
                {projects.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                    Nenhum projeto encontrado.
                  </div>
                ) : (
                  projects.map((project) => {
                    const active = selectedProject?.id === project.id;
                    const projectClient = firstRelationItem(project.client);
                    const statusMeta = getProjectStatusMeta(project.status);
                    const actionLoading = changingProjectActionId === project.id;
                    const projectPercent =
                      selectedProject?.id === project.id ? progressPercentage : project.progress_percent ?? 0;

                    return (
                      <div
                        key={project.id}
                        className={`relative w-full rounded-2xl border p-4 transition ${
                          active
                            ? "border-sky-200 bg-sky-50 shadow-sm"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => handleSelectProject(project.id)}
                            className="min-w-0 flex-1 text-left"
                          >
                            <div className="truncate font-semibold text-slate-900">{project.title}</div>
                            <div className="mt-1 truncate text-xs text-slate-500">
                              {projectClient?.full_name || projectClient?.email || "Sem cliente"}
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <span
                                className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${statusMeta.className}`}
                              >
                                {statusMeta.label}
                              </span>
                              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-700">
                                {projectPercent}%
                              </span>
                            </div>
                          </button>

                          {isManager ? (
                            <div className="relative shrink-0">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenProjectMenuId((prev) => (prev === project.id ? null : project.id));
                                }}
                                disabled={actionLoading}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
                              >
                                {actionLoading ? (
                                  <Loader2 size={15} className="animate-spin" />
                                ) : (
                                  <MoreHorizontal size={16} />
                                )}
                              </button>

                              {openProjectMenuId === project.id ? (
                                <div className="absolute right-0 top-11 z-20 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                                  <button
                                    type="button"
                                    onClick={() => handleProjectStatusChange(project.id, "concluido")}
                                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
                                  >
                                    <CheckCircle2 size={15} />
                                    Concluir projeto
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleProjectStatusChange(project.id, "pausado")}
                                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-amber-700 transition hover:bg-amber-50"
                                  >
                                    <PauseCircle size={15} />
                                    Pausar projeto
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleProjectStatusChange(project.id, "inativo")}
                                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                                  >
                                    <Briefcase size={15} />
                                    Inativar projeto
                                  </button>

                                  <div className="my-2 h-px bg-slate-100" />

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteProject(project.id)}
                                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-700 transition hover:bg-red-50"
                                  >
                                    <Trash2 size={15} />
                                    Excluir projeto
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <ClipboardList size={20} className="text-emerald-600" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Meu checklist diário</h3>
                  <p className="text-sm text-slate-500">
                    {isTodayChecklist ? "Seu foco do dia" : `Visualizando ${selectedChecklistDate}`}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="date"
                  value={selectedChecklistDate}
                  onChange={(e) => setSelectedChecklistDate(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={carryOverChecklistFromPreviousDay}
                  disabled={carryingOverChecklist}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
                >
                  {carryingOverChecklist ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
                  Puxar pendências do dia anterior
                </button>
              </div>

              <form onSubmit={handleAddChecklistItem} className="mt-4 space-y-3">
                <input
                  value={checklistTitle}
                  onChange={(e) => setChecklistTitle(e.target.value)}
                  placeholder="Ex: revisar cards do cliente X"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={creatingChecklist}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
                >
                  {creatingChecklist ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  Adicionar no checklist
                </button>
              </form>

              <div className="mt-4 space-y-3">
                {dailyChecklist.map((item) => (
                  <label
                    key={item.id}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <input
                      type="checkbox"
                      checked={item.is_done}
                      onChange={(e) => toggleChecklistItem(item.id, e.target.checked)}
                      className="h-4 w-4"
                    />
                    <span className={item.is_done ? "text-slate-400 line-through" : "text-slate-700"}>
                      {item.title}
                    </span>
                  </label>
                ))}

                {dailyChecklist.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                    Não há itens neste dia.
                  </div>
                ) : null}
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
              <div className="bg-[linear-gradient(135deg,#0f172a_0%,#10233f_55%,#12345e_100%)] p-6 text-white">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90">
                      <FolderKanban size={16} />
                      Workspace Comercial Web Division
                    </div>

                    <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
                      {selectedProject?.title || "Portal do Cliente"}
                    </h1>

                    <p className="mt-3 max-w-3xl text-sm leading-7 text-white/75 md:text-base">
                      {selectedProject?.description || "Selecione um projeto para visualizar o fluxo completo."}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <MetricCard
                      icon={<CheckCircle2 size={18} />}
                      label="Concluídas"
                      value={String(completedTasks)}
                    />
                    <MetricCard
                      icon={<Clock3 size={18} />}
                      label="Em processo"
                      value={String(pendingTasks)}
                    />
                  </div>
                </div>
              </div>

              <div className="p-6">
                {selectedProject ? (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                    <InfoBox
                      label="Cliente"
                      value={selectedClient?.full_name || selectedClient?.email || "—"}
                    />
                    <InfoBox
                      label="Criado por"
                      value={selectedCreator?.full_name || selectedCreator?.email || "—"}
                    />
                    <InfoBox label="Prazo" value={selectedProject.due_date || "Sem prazo"} />
                    <InfoBox label="Progresso" value={`${progressPercentage}%`} />
                    <InfoBox label="Cards no projeto" value={String(totalTasks)} />
                    <InfoBox
                      label="Status"
                      value={getProjectStatusMeta(selectedProject.status).label}
                    />
                  </div>
                ) : null}

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-slate-500">
                    <span>Saúde operacional</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#06b6d4,#3b82f6)] transition-all"
                      style={{ width: `${Math.max(0, Math.min(100, progressPercentage))}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {isManager ? (
              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      <Sparkles size={14} />
                      Gestão rápida
                    </div>
                    <h3 className="mt-3 text-xl font-black text-slate-900">Cadastros e operação</h3>
                    <p className="text-sm text-slate-500">
                      Crie cliente, equipe, projeto e tarefa sem sair da tela.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                    <TabButton
                      active={managementTab === "client"}
                      onClick={() => setManagementTab("client")}
                      icon={<UserPlus size={15} />}
                      label="Criar cliente"
                    />
                    <TabButton
                      active={managementTab === "team"}
                      onClick={() => setManagementTab("team")}
                      icon={<Users size={15} />}
                      label="Criar equipe"
                    />
                    <TabButton
                      active={managementTab === "project"}
                      onClick={() => setManagementTab("project")}
                      icon={<Briefcase size={15} />}
                      label="Criar projeto"
                    />
                    <TabButton
                      active={managementTab === "task"}
                      onClick={() => setManagementTab("task")}
                      icon={<LayoutGrid size={15} />}
                      label="Criar tarefa"
                    />
                  </div>
                </div>

                {managementTab === "client" ? (
                  <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                      <div className="mb-4 flex items-center gap-3">
                        <UserPlus size={18} className="text-sky-600" />
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">Novo cliente</h4>
                          <p className="text-sm text-slate-500">
                            Cadastre rapidamente um novo cliente para vincular aos projetos.
                          </p>
                        </div>
                      </div>

                      <form onSubmit={handleCreateClient} className="space-y-3">
                        <input
                          value={clientForm.full_name}
                          onChange={(e) => setClientForm((prev) => ({ ...prev, full_name: e.target.value }))}
                          placeholder="Nome do cliente"
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                        />

                        <input
                          type="email"
                          value={clientForm.email}
                          onChange={(e) => setClientForm((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="E-mail do cliente"
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                        />

                        <button
                          type="submit"
                          disabled={creatingClient}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
                        >
                          {creatingClient ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                          Criar cliente
                        </button>
                      </form>
                    </div>

                    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">Clientes cadastrados</h4>
                          <p className="text-sm text-slate-500">Base disponível para novos projetos</p>
                        </div>
                        <button
                          type="button"
                          onClick={refreshPeopleOptions}
                          disabled={loadingPeople}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-60"
                        >
                          {loadingPeople ? <Loader2 size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
                          Atualizar
                        </button>
                      </div>

                      <div className="space-y-3">
                        {clients.slice(0, 8).map((client) => (
                          <div key={client.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                            <div className="font-semibold text-slate-900">{client.full_name || "Sem nome"}</div>
                            <div className="text-sm text-slate-500">{client.email || "Sem e-mail"}</div>
                          </div>
                        ))}

                        {clients.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                            Nenhum cliente cadastrado ainda.
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : null}

                {managementTab === "team" ? (
                  <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                      <div className="mb-4 flex items-center gap-3">
                        <ShieldCheck size={18} className="text-emerald-600" />
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">Novo membro da equipe</h4>
                          <p className="text-sm text-slate-500">
                            Cadastre um responsável comercial, gestor ou colaborador.
                          </p>
                        </div>
                      </div>

                      <form onSubmit={handleCreateTeamUser} className="space-y-3">
                        <input
                          value={teamForm.full_name}
                          onChange={(e) => setTeamForm((prev) => ({ ...prev, full_name: e.target.value }))}
                          placeholder="Nome do colaborador"
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                        />

                        <input
                          type="email"
                          value={teamForm.email}
                          onChange={(e) => setTeamForm((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="E-mail do colaborador"
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                        />

                        <select
                          value={teamForm.role}
                          onChange={(e) => setTeamForm((prev) => ({ ...prev, role: e.target.value }))}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                        >
                          <option value="team">Equipe</option>
                          <option value="admin">Admin</option>
                        </select>

                        <button
                          type="submit"
                          disabled={creatingTeamUser}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
                        >
                          {creatingTeamUser ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                          Criar equipe
                        </button>
                      </form>
                    </div>

                    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">Equipe cadastrada</h4>
                          <p className="text-sm text-slate-500">Responsáveis disponíveis no projeto</p>
                        </div>
                        <button
                          type="button"
                          onClick={refreshPeopleOptions}
                          disabled={loadingPeople}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-60"
                        >
                          {loadingPeople ? <Loader2 size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
                          Atualizar
                        </button>
                      </div>

                      <div className="space-y-3">
                        {teamUsers.slice(0, 8).map((member) => (
                          <div key={member.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <div className="truncate font-semibold text-slate-900">
                                  {member.full_name || "Sem nome"}
                                </div>
                                <div className="truncate text-sm text-slate-500">
                                  {member.email || "Sem e-mail"}
                                </div>
                              </div>
                              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-700">
                                {member.role}
                              </span>
                            </div>
                          </div>
                        ))}

                        {teamUsers.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                            Nenhum membro cadastrado ainda.
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : null}

                {managementTab === "project" ? (
                  <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Briefcase size={18} className="text-sky-600" />
                          <div>
                            <h4 className="text-lg font-bold text-slate-900">Criar projeto</h4>
                            <p className="text-sm text-slate-500">
                              Vincule um cliente e abra a operação no kanban.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={refreshPeopleOptions}
                          disabled={loadingPeople}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-60"
                        >
                          {loadingPeople ? <Loader2 size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
                          Atualizar clientes
                        </button>
                      </div>

                      <form onSubmit={handleCreateProject} className="space-y-3">
                        <input
                          value={projectForm.title}
                          onChange={(e) => setProjectForm((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Nome do projeto"
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                        />

                        <textarea
                          value={projectForm.description}
                          onChange={(e) => setProjectForm((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="Descrição do projeto"
                          className="min-h-[110px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                        />

                        <select
                          value={projectForm.client_id}
                          onChange={(e) => setProjectForm((prev) => ({ ...prev, client_id: e.target.value }))}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                        >
                          <option value="">Selecione o cliente</option>
                          {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                              {client.full_name || client.email}
                            </option>
                          ))}
                        </select>

                        {clients.length === 0 ? (
                          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                            Nenhum cliente encontrado. Cadastre primeiro em “Criar cliente”.
                          </div>
                        ) : null}

                        <input
                          type="date"
                          value={projectForm.due_date}
                          onChange={(e) => setProjectForm((prev) => ({ ...prev, due_date: e.target.value }))}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                        />

                        <button
                          type="submit"
                          disabled={creatingProject || clients.length === 0}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
                        >
                          {creatingProject ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                          Criar projeto
                        </button>
                      </form>
                    </div>

                    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                      <div className="mb-4">
                        <h4 className="text-lg font-bold text-slate-900">Fluxo recomendado</h4>
                        <p className="text-sm text-slate-500">
                          Uma ordem melhor para tua operação comercial.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <FlowStep
                          number="1"
                          title="Cadastre o cliente"
                          description="Primeiro cria o cliente para ele aparecer na base."
                        />
                        <FlowStep
                          number="2"
                          title="Abra o projeto"
                          description="Depois vincula o cliente a um projeto com prazo e descrição."
                        />
                        <FlowStep
                          number="3"
                          title="Crie as tarefas"
                          description="Distribui para o time, define prioridade, escolhe a coluna do kanban e salva."
                        />
                        <FlowStep
                          number="4"
                          title="Acompanhe no kanban"
                          description="A tarefa vai aparecer dentro da coluna escolhida no projeto selecionado."
                        />
                      </div>
                    </div>
                  </div>
                ) : null}

                {managementTab === "task" ? (
                  <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <LayoutGrid size={18} className="text-emerald-600" />
                          <div>
                            <h4 className="text-lg font-bold text-slate-900">Criar tarefa</h4>
                            <p className="text-sm text-slate-500">
                              Organize o time comercial dentro do projeto selecionado.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => selectedProject && loadProjectBundle(selectedProject.id)}
                          disabled={!selectedProject || loadingProject}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-60"
                        >
                          {loadingProject ? <Loader2 size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
                          Atualizar colunas
                        </button>
                      </div>

                      <form onSubmit={handleCreateTask} className="space-y-3">
                        <select
                          value={taskForm.project_id}
                          onChange={(e) => handleTaskProjectChange(e.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                        >
                          <option value="">Selecione o projeto</option>
                          {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                              {project.title}
                            </option>
                          ))}
                        </select>

                        <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
                          {selectedProject
                            ? `As colunas abaixo pertencem ao projeto: ${selectedProject.title}`
                            : "Escolha um projeto para carregar as colunas do kanban."}
                        </div>

                        <input
                          value={taskForm.title}
                          onChange={(e) => setTaskForm((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Título da tarefa"
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                        />

                        <textarea
                          value={taskForm.description}
                          onChange={(e) => setTaskForm((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="Descrição"
                          className="min-h-[110px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                        />

                        <div className="grid gap-3 md:grid-cols-2">
                          <select
                            value={taskForm.column_id}
                            onChange={(e) => setTaskForm((prev) => ({ ...prev, column_id: e.target.value }))}
                            disabled={!selectedProject || columns.length === 0}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">
                              {!selectedProject
                                ? "Selecione um projeto primeiro"
                                : columns.length === 0
                                ? "Sem colunas neste projeto"
                                : "Selecione a coluna"}
                            </option>
                            {columns.map((column) => (
                              <option key={column.id} value={column.id}>
                                {column.name}
                              </option>
                            ))}
                          </select>

                          <select
                            value={taskForm.assigned_to}
                            onChange={(e) => setTaskForm((prev) => ({ ...prev, assigned_to: e.target.value }))}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                          >
                            <option value="">Responsável</option>
                            {teamUsers.map((member) => (
                              <option key={member.id} value={member.id}>
                                {member.full_name || member.email}
                              </option>
                            ))}
                          </select>
                        </div>

                        {!selectedProject ? (
                          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                            Selecione ou crie um projeto antes de cadastrar tarefas.
                          </div>
                        ) : null}

                        {selectedProject && columns.length === 0 ? (
                          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                            Esse projeto ainda não possui colunas no kanban.
                          </div>
                        ) : null}

                        <div className="grid gap-3 md:grid-cols-2">
                          <select
                            value={taskForm.priority}
                            onChange={(e) => setTaskForm((prev) => ({ ...prev, priority: e.target.value }))}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                          >
                            <option value="baixa">Baixa</option>
                            <option value="media">Média</option>
                            <option value="alta">Alta</option>
                            <option value="urgente">Urgente</option>
                          </select>

                          <input
                            type="date"
                            value={taskForm.due_date}
                            onChange={(e) => setTaskForm((prev) => ({ ...prev, due_date: e.target.value }))}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                          />
                        </div>

                        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            checked={taskForm.is_visible_to_client}
                            onChange={(e) =>
                              setTaskForm((prev) => ({
                                ...prev,
                                is_visible_to_client: e.target.checked,
                              }))
                            }
                          />
                          Visível para o cliente
                        </label>

                        <button
                          type="submit"
                          disabled={creatingTask || !selectedProject || columns.length === 0}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
                        >
                          {creatingTask ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                          Criar tarefa
                        </button>
                      </form>
                    </div>

                    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                      <div className="mb-4">
                        <h4 className="text-lg font-bold text-slate-900">Painel da operação</h4>
                        <p className="text-sm text-slate-500">
                          Resumo rápido do projeto atual.
                        </p>
                      </div>

                      <div className="grid gap-3">
                        <SummaryBox
                          icon={<Briefcase size={16} />}
                          label="Projeto atual"
                          value={selectedProject?.title || "Nenhum selecionado"}
                        />
                        <SummaryBox
                          icon={<Users size={16} />}
                          label="Equipe disponível"
                          value={String(teamUsers.length)}
                        />
                        <SummaryBox
                          icon={<CheckCircle2 size={16} />}
                          label="Concluídas"
                          value={String(completedTasks)}
                        />
                        <SummaryBox
                          icon={<Clock3 size={16} />}
                          label="Pendentes"
                          value={String(pendingTasks)}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FolderKanban size={20} className="text-sky-600" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Kanban do projeto</h3>
                    <p className="text-sm text-slate-500">
                      Clique no card para abrir detalhes, comentários e checklist
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => selectedProject && loadProjectBundle(selectedProject.id)}
                  disabled={!selectedProject}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-60"
                >
                  <RefreshCcw size={16} />
                  Atualizar
                </button>
              </div>

              {!selectedProject ? (
                <div className="rounded-[20px] border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                  Nenhum projeto selecionado.
                </div>
              ) : loadingProject ? (
                <div className="flex min-h-[260px] items-center justify-center">
                  <Loader2 className="animate-spin text-sky-600" size={26} />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="flex min-w-[1200px] gap-5">
                    {groupedTasks.map((column) => {
                      const style = getColumnStyle(column.slug);

                      return (
                        <div
                          key={column.id}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            const taskId = e.dataTransfer.getData("text/plain");
                            if (taskId) void handleMoveTask(taskId, column.id);
                          }}
                          className={`w-[320px] shrink-0 overflow-hidden rounded-[24px] border ${style.wrap} shadow-sm`}
                        >
                          <div className={`h-1.5 w-full ${style.top}`} />
                          <div className="p-4">
                            <div className="mb-4 flex items-center justify-between gap-3">
                              <div>
                                <div className="font-bold text-slate-900">{column.name}</div>
                                <div className="text-xs text-slate-500">{column.tasks.length} card(s)</div>
                              </div>

                              <div className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${style.badge}`}>
                                {column.tasks.length}
                              </div>
                            </div>

                            <div className="space-y-3">
                              {column.tasks.map((task) => {
                                const assigned = firstRelationItem(task.assigned);
                                const creator = firstRelationItem(task.creator);
                                const taskComments = commentsByTask[task.id] ?? [];
                                const lastComment = taskComments[0];
                                const checklistItems = getTaskChecklist(task.id);
                                const checklistDone = checklistItems.filter((item) => item.done).length;
                                const isDoneColumn = column.slug === "concluido";

                                return (
                                  <div
                                    key={task.id}
                                    draggable
                                    onDragStart={(e) => e.dataTransfer.setData("text/plain", task.id)}
                                    onClick={() => openTaskModal(task)}
                                    className={`group cursor-pointer rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                                      isDoneColumn ? "p-3" : ""
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="min-w-0">
                                        <div className="line-clamp-2 font-semibold text-slate-900">
                                          {task.title}
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        {movingTaskId === task.id ? (
                                          <Loader2 size={14} className="animate-spin text-sky-600" />
                                        ) : null}
                                        <Eye size={14} className="text-slate-400 transition group-hover:text-sky-600" />
                                      </div>
                                    </div>

                                    {!isDoneColumn && task.description ? (
                                      <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600">
                                        {task.description}
                                      </p>
                                    ) : null}

                                    <div className="mt-3 flex flex-wrap gap-2">
                                      <span
                                        className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${getPriorityClass(
                                          task.priority
                                        )}`}
                                      >
                                        {task.priority}
                                      </span>

                                      {task.is_visible_to_client ? (
                                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-600">
                                          cliente vê
                                        </span>
                                      ) : (
                                        <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-amber-600">
                                          interno
                                        </span>
                                      )}
                                    </div>

                                    <div className="mt-3 grid gap-2 text-xs text-slate-500">
                                      <div className="flex items-center justify-between gap-3">
                                        <span>Responsável</span>
                                        <span className="truncate font-medium text-slate-700">
                                          {assigned?.full_name || assigned?.email || "Não definido"}
                                        </span>
                                      </div>

                                      <div className="flex items-center justify-between gap-3">
                                        <span>Prazo</span>
                                        <span className="font-medium text-slate-700">
                                          {task.due_date || "Sem prazo"}
                                        </span>
                                      </div>

                                      <div className="flex items-center justify-between gap-3">
                                        <span>Comentários</span>
                                        <span className="font-medium text-slate-700">
                                          {taskComments.length}
                                        </span>
                                      </div>
                                    </div>

                                    {lastComment ? (
                                      <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                                        <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                                          <MessageSquare size={12} />
                                          Último comentário
                                        </div>
                                        <p className="line-clamp-2 text-xs leading-5 text-slate-700">
                                          {lastComment.content}
                                        </p>
                                      </div>
                                    ) : null}

                                    <div className="mt-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                                      <div className="flex items-center gap-2">
                                        <CheckSquare size={13} />
                                        Checklist
                                      </div>
                                      <div className="font-semibold text-slate-800">
                                        {checklistDone}/{checklistItems.length}
                                      </div>
                                    </div>

                                    {!isDoneColumn ? (
                                      <div className="mt-3 text-[11px] text-slate-400">
                                        Criado por: {creator?.full_name || creator?.email || "Não definido"}
                                      </div>
                                    ) : null}
                                  </div>
                                );
                              })}

                              {column.tasks.length === 0 ? (
                                <div className="rounded-[20px] border border-dashed border-slate-200 bg-white/70 p-4 text-sm text-slate-500">
                                  Arraste uma tarefa para cá.
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <MessageSquare size={20} className="text-sky-600" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Comentários</h3>
                  <p className="text-sm text-slate-500">Observações do projeto</p>
                </div>
              </div>

              <form onSubmit={handleAddComment} className="space-y-3">
                <select
                  value={commentForm.task_id}
                  onChange={(e) => setCommentForm((prev) => ({ ...prev, task_id: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                >
                  <option value="">Selecione a tarefa</option>
                  {tasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.title}
                    </option>
                  ))}
                </select>

                <textarea
                  value={commentForm.content}
                  onChange={(e) => setCommentForm((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Digite uma observação..."
                  className="min-h-[100px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                />

                {isManager ? (
                  <select
                    value={commentForm.visibility}
                    onChange={(e) =>
                      setCommentForm((prev) => ({
                        ...prev,
                        visibility: e.target.value as "publico" | "interno",
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                  >
                    <option value="publico">Público</option>
                    <option value="interno">Interno</option>
                  </select>
                ) : null}

                <button
                  type="submit"
                  disabled={savingComment || !selectedProject}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
                >
                  {savingComment ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  Adicionar comentário
                </button>
              </form>

              <div className="mt-4 space-y-3">
                {comments.slice(0, 8).map((comment) => {
                  const author = firstRelationItem(comment.author);

                  return (
                    <div key={comment.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-slate-900">
                          {author?.full_name || author?.email || "Usuário"}
                        </div>
                        <div className="text-[11px] uppercase tracking-[0.12em] text-slate-400">
                          {comment.visibility}
                        </div>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{comment.content}</p>
                    </div>
                  );
                })}

                {comments.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                    Sem comentários ainda.
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <Activity size={20} className="text-emerald-600" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Histórico</h3>
                  <p className="text-sm text-slate-500">Últimas movimentações</p>
                </div>
              </div>

              <div className="space-y-3">
                {activities.map((item) => {
                  const actor = firstRelationItem(item.actor);

                  return (
                    <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-sm font-semibold text-slate-900">
                        {item.description || item.action}
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500">
                        <span>{actor?.full_name || actor?.email || "Sistema"}</span>
                        <span>{new Date(item.created_at).toLocaleString("pt-BR")}</span>
                      </div>
                    </div>
                  );
                })}

                {activities.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                    Sem histórico por enquanto.
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <Users size={20} className="text-sky-600" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Resumo rápido</h3>
                  <p className="text-sm text-slate-500">Visão geral operacional</p>
                </div>
              </div>

              <div className="grid gap-3">
                <SummaryBox
                  icon={<Calendar size={16} />}
                  label="Prazo do projeto"
                  value={selectedProject?.due_date || "Sem prazo"}
                />
                <SummaryBox
                  icon={<CheckCircle2 size={16} />}
                  label="Cards concluídos"
                  value={String(completedTasks)}
                />
                <SummaryBox
                  icon={<Clock3 size={16} />}
                  label="Cards pendentes"
                  value={String(pendingTasks)}
                />
                <SummaryBox
                  icon={<Users size={16} />}
                  label="Clientes"
                  value={String(clients.length)}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>

      {taskModalOpen && selectedTask ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-[0.16em] text-sky-600">Detalhe do card</div>
                <h3 className="mt-1 truncate text-2xl font-black text-slate-900">{selectedTask.title}</h3>
              </div>

              <button
                onClick={closeTaskModal}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[calc(92vh-84px)] overflow-y-auto px-6 py-6">
              <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-6">
                  <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${getPriorityClass(
                          selectedTask.priority
                        )}`}
                      >
                        {selectedTask.priority}
                      </span>
                      {selectedTask.is_visible_to_client ? (
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-600">
                          cliente vê
                        </span>
                      ) : (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-amber-600">
                          interno
                        </span>
                      )}
                    </div>

                    <p className="text-sm leading-7 text-slate-700">
                      {selectedTask.description || "Sem descrição cadastrada."}
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <MiniInfo
                        label="Responsável"
                        value={
                          firstRelationItem(selectedTask.assigned)?.full_name ||
                          firstRelationItem(selectedTask.assigned)?.email ||
                          "Não definido"
                        }
                      />
                      <MiniInfo
                        label="Criado por"
                        value={
                          firstRelationItem(selectedTask.creator)?.full_name ||
                          firstRelationItem(selectedTask.creator)?.email ||
                          "Não definido"
                        }
                      />
                      <MiniInfo label="Prazo" value={selectedTask.due_date || "Sem prazo"} />
                      <MiniInfo label="Status" value={selectedTask.status} />
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <CheckSquare size={18} className="text-emerald-600" />
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">Checklist do card</h4>
                        <p className="text-sm text-slate-500">Clique nos itens para marcar.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <input
                        value={newTaskChecklistTitle}
                        onChange={(e) => setNewTaskChecklistTitle(e.target.value)}
                        placeholder="Adicionar item ao checklist"
                        className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => addTaskChecklistItem(selectedTask.id)}
                        className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="mt-4 space-y-3">
                      {getTaskChecklist(selectedTask.id).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleTaskChecklist(selectedTask.id, item.id)}
                          className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:bg-slate-50"
                        >
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                              item.done
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : "border-slate-300 bg-white text-transparent"
                            }`}
                          >
                            <Check size={12} />
                          </div>
                          <span className={item.done ? "text-slate-400 line-through" : "text-slate-700"}>
                            {item.title}
                          </span>
                        </button>
                      ))}

                      {getTaskChecklist(selectedTask.id).length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                          Nenhum item no checklist deste card.
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <MessageSquare size={18} className="text-sky-600" />
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">Comentários do card</h4>
                        <p className="text-sm text-slate-500">As observações aparecem aqui e no card.</p>
                      </div>
                    </div>

                    <form onSubmit={handleAddComment} className="space-y-3">
                      <textarea
                        value={commentForm.task_id === selectedTask.id ? commentForm.content : ""}
                        onChange={(e) =>
                          setCommentForm((prev) => ({
                            ...prev,
                            task_id: selectedTask.id,
                            content: e.target.value,
                          }))
                        }
                        placeholder="Escreva um comentário sobre este card..."
                        className="min-h-[110px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                      />

                      <select
                        value={commentForm.visibility}
                        onChange={(e) =>
                          setCommentForm((prev) => ({
                            ...prev,
                            visibility: e.target.value as "publico" | "interno",
                            task_id: selectedTask.id,
                          }))
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                      >
                        <option value="publico">Público</option>
                        <option value="interno">Interno</option>
                      </select>

                      <button
                        type="submit"
                        disabled={savingComment}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
                      >
                        {savingComment ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                        Adicionar comentário
                      </button>
                    </form>

                    <div className="mt-4 space-y-3">
                      {selectedTaskComments.map((comment) => {
                        const author = firstRelationItem(comment.author);

                        return (
                          <div key={comment.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="flex items-center justify-between gap-3">
                              <div className="text-sm font-semibold text-slate-900">
                                {author?.full_name || author?.email || "Usuário"}
                              </div>
                              <div className="text-[11px] uppercase tracking-[0.12em] text-slate-400">
                                {comment.visibility}
                              </div>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-slate-700">{comment.content}</p>
                            <div className="mt-2 text-xs text-slate-400">
                              {new Date(comment.created_at).toLocaleString("pt-BR")}
                            </div>
                          </div>
                        );
                      })}

                      {selectedTaskComments.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                          Esse card ainda não possui comentários.
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {deleteProjectId ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">Excluir projeto</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Essa ação vai remover o projeto, colunas, tarefas, comentários e histórico vinculados.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDeleteProjectId(null)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteProjectId(null)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmDeleteProject}
                className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Confirmar exclusão
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
      {label}: <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">{label}</div>
      <div className="mt-2 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white/90">
        {icon}
      </div>
      <div className="mt-3 text-2xl font-black text-white">{value}</div>
      <div className="text-sm text-white/70">{label}</div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">{label}</div>
      <div className="mt-2 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function SummaryBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-xs uppercase tracking-[0.12em]">{label}</span>
      </div>
      <div className="mt-2 text-base font-bold text-slate-900">{value}</div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
        active
          ? "border-sky-200 bg-sky-50 text-sky-700"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function FlowStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sm font-black text-sky-600">
        {number}
      </div>
      <div>
        <div className="font-semibold text-slate-900">{title}</div>
        <div className="mt-1 text-sm leading-6 text-slate-500">{description}</div>
      </div>
    </div>
  );
}