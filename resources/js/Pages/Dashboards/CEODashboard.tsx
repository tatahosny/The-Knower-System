import { useTranslation } from "react-i18next";
import { TrendingUp, Users, DollarSign, Target } from "lucide-react";
import { StaggerList } from "@/components/animations/StaggerList";
import { StatCard } from "@/components/stat-card";
import { PageHeader } from "@/components/page-header";
import { useAuth } from "@/store/auth";

export default function CEODashboard() {
  const { t } = useTranslation();
  const user = useAuth((s) => s.user);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Executive Dashboard - ${t("dashboard.welcome")}, ${user?.name?.split(" ")[0] ?? ""} 👋`}
        description="High-level overview of company performance and key metrics."
      />

      <StaggerList className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.05}>
        <StatCard label="Monthly Revenue" value="$142,500" icon={DollarSign} accent="success" />
        <StatCard label="Active Clients" value={84} icon={Users} accent="primary" />
        <StatCard label="Growth Rate" value="+15.2%" icon={TrendingUp} accent="primary" />
        <StatCard label="Key Objectives Met" value={12} icon={Target} />
      </StaggerList>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Financial Overview</h3>
          <p className="text-muted-foreground text-sm">Revenue charts and financial summaries will appear here.</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Department Performance</h3>
          <p className="text-muted-foreground text-sm">KPIs from different departments (Sales, HR, Engineering).</p>
        </div>
      </div>
    </div>
  );
}
