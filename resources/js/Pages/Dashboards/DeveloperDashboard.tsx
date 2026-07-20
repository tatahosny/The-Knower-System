import { useTranslation } from "react-i18next";
import { Bug, CheckCircle, Clock, GitPullRequest } from "lucide-react";
import { StaggerList } from "@/components/animations/StaggerList";
import { StatCard } from "@/components/stat-card";
import { PageHeader } from "@/components/page-header";
import { useAuth } from "@/store/auth";

export default function DeveloperDashboard() {
  const { t } = useTranslation();
  const user = useAuth((s) => s.user);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Developer Dashboard - ${t("dashboard.welcome")}, ${user?.name?.split(" ")[0] ?? ""} 👋`}
        description="Track your assigned tasks, active bugs, and code reviews."
      />

      <StaggerList className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.05}>
        <StatCard label="Assigned Tasks" value={14} icon={Clock} accent="primary" />
        <StatCard label="Active Bugs" value={3} icon={Bug} accent="destructive" />
        <StatCard label="Pending PRs" value={5} icon={GitPullRequest} accent="primary" />
        <StatCard label="Tasks Completed" value={42} icon={CheckCircle} accent="success" />
      </StaggerList>

      <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">My Sprint Board</h3>
        <p className="text-muted-foreground text-sm">Kanban board for current sprint tasks will appear here.</p>
      </div>
    </div>
  );
}
