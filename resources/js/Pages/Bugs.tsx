import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, add } from "@/mocks/store";
import { makeId, type Bug } from "@/mocks/data";
import { shortDate } from "@/lib/format";

export default function BugsPage() {
  const { t } = useTranslation();
  const rows = useCollection("bugs");
  const projects = useCollection("projects");
  return (
    <ResourcePage<Bug>
      title={t("nav.bugs")}
      description="Defects reported across projects"
      rows={rows}
      newLabel="Report bug"
      columns={[
        { key: "title", header: t("common.title"), cell: (r) => <span className="font-medium">{r.title}</span> },
        { key: "project", header: "Project", cell: (r) => projects.find((p) => p.id === r.projectId)?.name ?? "—" },
        { key: "severity", header: "Severity", cell: (r) => <StatusBadge value={r.severity} /> },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status} /> },
        { key: "assignee", header: "Assigned to", cell: (r) => r.assignedTo },
        { key: "reporter", header: "Reported by", cell: (r) => r.reportedBy },
        { key: "created", header: t("common.created"), cell: (r) => <span className="text-xs text-muted-foreground">{shortDate(r.createdAt)}</span> },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={(v) => {
            add("bugs", {
              id: makeId("bg"),
              projectId: v.projectId,
              title: v.title,
              severity: (v.severity as Bug["severity"]) || "medium",
              status: "open",
              reportedBy: v.reportedBy || "QA",
              assignedTo: v.assignedTo || "Unassigned",
              createdAt: new Date().toISOString(),
            });
            close();
          }}
          fields={[
            { name: "title", label: "Title", type: "text", required: true },
            { name: "projectId", label: "Project", type: "select", options: projects.map((p) => ({ value: p.id, label: p.name })), required: true },
            {
              name: "severity",
              label: "Severity",
              type: "select",
              defaultValue: "medium",
              options: [
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
                { value: "critical", label: "Critical" },
              ],
            },
            { name: "reportedBy", label: "Reported by", type: "text", defaultValue: "QA" },
            { name: "assignedTo", label: "Assign to", type: "text" },
          ]}
        />
      )}
    />
  );
}
