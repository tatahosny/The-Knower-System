import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, update } from "@/mocks/store";
import { shortDate } from "@/lib/format";
import type { Task } from "@/mocks/data";
import { cn } from "@/lib/utils";

const COLUMNS: Array<{ key: Task["status"]; label: string }> = [
  { key: "todo", label: "To do" },
  { key: "in_progress", label: "In progress" },
  { key: "review", label: "Review" },
  { key: "done", label: "Done" },
];

export default function TasksPage() {
  const { t } = useTranslation();
  const tasks = useCollection("tasks");
  const projects = useCollection("projects");

  const move = (id: string, status: Task["status"]) => update("tasks", id, { status });

  const groupedTasks = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    const pId = task.projectId || "unassigned";
    if (!acc[pId]) acc[pId] = [];
    acc[pId].push(task);
    return acc;
  }, {});

  return (
    <div className="space-y-10">
      <PageHeader
        title={t("nav.tasks")}
        description="Drag-free kanban — click a status to move a task."
      />
      
      {Object.entries(groupedTasks).map(([projectId, projectTasks]) => {
        const project = projects.find((p) => p.id === projectId);
        const projectName = project ? project.name : "Unassigned Tasks";
        
        return (
          <div key={projectId} className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <h2 className="font-display text-lg font-bold text-foreground">{projectName}</h2>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {projectTasks.length} {t("nav.tasks")}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {COLUMNS.map((col) => {
                const items = projectTasks.filter((t) => t.status === col.key);
                return (
                  <div key={col.key} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-display text-sm font-semibold">{col.label}</h3>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{items.length}</span>
                    </div>
                    <div className="space-y-2">
                      {items.length === 0 && (
                        <p className="rounded-md border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
                          Empty
                        </p>
                      )}
                      {items.map((task) => (
                        <div
                          key={task.id}
                          className="group rounded-lg border border-border bg-background p-3 transition-colors hover:border-primary/40"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium leading-snug">{task.title}</p>
                            <StatusBadge value={task.priority} />
                          </div>
                          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                            <span>{task.assignee}</span>
                            <span>{shortDate(task.dueDate)}</span>
                          </div>
                          <div className="mt-3 flex gap-1">
                            {COLUMNS.filter((c) => c.key !== task.status).map((c) => (
                              <button
                                key={c.key}
                                onClick={() => move(task.id, c.key)}
                                className={cn(
                                  "flex-1 rounded border border-border/60 py-1 text-[10px] transition-colors hover:border-primary hover:text-primary opacity-0 transition-opacity group-hover:opacity-100",
                                )}
                              >
                                → {c.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
