import { useTranslation } from "react-i18next";
import { Users, UserPlus, Calendar, Clock } from "lucide-react";
import { StaggerList } from "@/components/animations/StaggerList";
import { StatCard } from "@/components/stat-card";
import { PageHeader } from "@/components/page-header";
import { useAuth } from "@/store/auth";

export default function HRDashboard() {
  const { t } = useTranslation();
  const user = useAuth((s) => s.user);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`HR Dashboard - ${t("dashboard.welcome")}, ${user?.name?.split(" ")[0] ?? ""} 👋`}
        description="Manage employees, attendance, and human resources operations."
      />

      <StaggerList className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.05}>
        <StatCard label="Total Employees" value={142} icon={Users} accent="primary" />
        <StatCard label="On Leave Today" value={5} icon={Calendar} accent="destructive" />
        <StatCard label="New Hires (This Month)" value={12} icon={UserPlus} accent="success" />
        <StatCard label="Pending Applications" value={34} icon={Clock} />
      </StaggerList>

      <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Recent HR Activity</h3>
        <p className="text-muted-foreground text-sm">Employee attendance records and leave requests will appear here.</p>
      </div>
    </div>
  );
}
