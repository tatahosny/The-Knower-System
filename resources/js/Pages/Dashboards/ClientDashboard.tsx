import { useTranslation } from "react-i18next";
import { FolderKanban, FileText, LifeBuoy, CreditCard } from "lucide-react";
import { StaggerList } from "@/components/animations/StaggerList";
import { StatCard } from "@/components/stat-card";
import { PageHeader } from "@/components/page-header";
import { useAuth } from "@/store/auth";

export default function ClientDashboard() {
  const { t } = useTranslation();
  const user = useAuth((s) => s.user);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Client Portal - ${t("dashboard.welcome")}, ${user?.name?.split(" ")[0] ?? ""} 👋`}
        description="View your active projects, invoices, and support tickets."
      />

      <StaggerList className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.05}>
        <StatCard label="Active Projects" value={2} icon={FolderKanban} accent="primary" />
        <StatCard label="Open Tickets" value={1} icon={LifeBuoy} accent="primary" />
        <StatCard label="Unpaid Invoices" value={1} icon={CreditCard} accent="destructive" />
        <StatCard label="Signed Contracts" value={3} icon={FileText} accent="success" />
      </StaggerList>

      <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Project Progress</h3>
        <p className="text-muted-foreground text-sm">Visual timeline of ongoing projects will appear here.</p>
      </div>
    </div>
  );
}
