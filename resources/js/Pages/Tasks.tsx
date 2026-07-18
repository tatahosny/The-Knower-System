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

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("nav.tasks")}
        description="Drag-free kanban — click a status to move a task."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const items = tasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className="rounded-xl border border-border bg-card p-4">
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
                {items.map((task) => {
                  const project = projects.find((p) => p.id === task.projectId);
                  return (
                    <div
                      key={task.id}
                      className="group rounded-lg border border-border bg-background p-3 transition-colors hover:border-primary/40"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-snug">{task.title}</p>
                        <StatusBadge value={task.priority} />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{project?.name}</p>
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
                              "flex-1 rounded border border-border/60 py-1 text-[10px] transition-colors hover:border-primary hover:text-primary",
                            )}
                          >
                            → {c.label}
                          </button>
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
    </div>
  );
}
