import { useTranslation } from "react-i18next";
import {
  Users,
  UserPlus,
  FolderKanban,
  Trophy,
  AlertOctagon,
  DollarSign,
  Wallet,
  FileWarning,
  LifeBuoy,
  Signal,
  Globe,
  ShieldAlert,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";
import { StaggerList } from "@/components/animations/StaggerList";
import { StatCard } from "@/components/stat-card";
import { PageHeader } from "@/components/page-header";
import { useCollection, seed } from "@/mocks/store";
import { money } from "@/lib/format";
import { useAuth } from "@/store/auth";
import { StatusBadge } from "@/components/status-badge";

export default function DashboardPage() {
  const { t } = useTranslation();
  const user = useAuth((s) => s.user);
  const clients = useCollection("clients");
  const projects = useCollection("projects");
  const invoices = useCollection("invoices");
  const tickets = useCollection("tickets");
  const employees = useCollection("employees");
  const domains = useCollection("domains");
  const hosting = useCollection("hostingAccounts");
  const notifications = useCollection("notifications");

  const active = projects.filter((p) => p.status === "in_progress").length;
  const completed = projects.filter((p) => p.status === "completed").length;
  const overdue = projects.filter((p) => p.status === "overdue").length;
  const unpaid = invoices.filter((i) => i.status === "sent" || i.status === "overdue");
  const monthlyRev = 34100;
  const annualRev = 194300;
  const openTickets = tickets.filter((t) => t.status === "open" || t.status === "in_progress").length;
  const online = employees.filter((e) => e.status === "active").length;
  const expDomains = domains.filter((d) => d.status !== "active").length;
  const expHosting = hosting.filter((h) => h.status !== "active").length;

  const statusData = [
    { name: "In progress", value: active, fill: "var(--chart-1)" },
    { name: "Planning", value: projects.filter((p) => p.status === "planning").length, fill: "var(--chart-2)" },
    { name: "Completed", value: completed, fill: "var(--chart-3)" },
    { name: "Overdue", value: overdue, fill: "var(--chart-5)" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${t("dashboard.welcome")}, ${user?.name?.split(" ")[0] ?? ""} 👋`}
        description={t("app.tagline")}
      />

      <StaggerList className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.05}>
        <StatCard label={t("dashboard.clients")} value={clients.length} icon={Users} delta="+2 this month" accent="primary" />
        <StatCard label={t("dashboard.newClients")} value={2} icon={UserPlus} delta="last 30 days" />
        <StatCard label={t("dashboard.activeProjects")} value={active} icon={FolderKanban} />
        <StatCard label={t("dashboard.completedProjects")} value={completed} icon={Trophy} accent="success" />
        <StatCard label={t("dashboard.overdueProjects")} value={overdue} icon={AlertOctagon} accent="destructive" />
        <StatCard label={t("dashboard.monthlyRevenue")} value={money(monthlyRev)} icon={DollarSign} accent="success" delta="+18% vs last mo" />
        <StatCard label={t("dashboard.annualRevenue")} value={money(annualRev)} icon={Wallet} />
        <StatCard label={t("dashboard.unpaidInvoices")} value={unpaid.length} icon={FileWarning} accent="warning" />
        <StatCard label={t("dashboard.openTickets")} value={openTickets} icon={LifeBuoy} accent="warning" />
        <StatCard label={t("dashboard.onlineEmployees")} value={online} icon={Signal} accent="success" />
        <StatCard label={t("dashboard.expiringDomains")} value={expDomains} icon={Globe} accent="warning" />
        <StatCard label={t("dashboard.expiringHosting")} value={expHosting} icon={ShieldAlert} accent="warning" />
      </StaggerList>

      <StaggerList className="grid grid-cols-1 gap-4 lg:grid-cols-3" staggerDelay={0.1}>
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">{t("dashboard.revenueTrend")}</h3>
            <span className="text-xs text-muted-foreground">Last 8 months</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={seed.revenueSeries}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                  formatter={(v) => money(Number(v))}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2} fill="url(#rev)" />
                <Area type="monotone" dataKey="expense" stroke="var(--chart-3)" strokeWidth={2} fill="url(#exp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-display text-base font-semibold">{t("dashboard.projectsByStatus")}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {statusData.map((d, i) => (
                    <Cell key={i} fill={d.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </StaggerList>

      <StaggerList className="grid grid-cols-1 gap-4 lg:grid-cols-2" staggerDelay={0.2}>
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-display text-base font-semibold">{t("dashboard.recentActivity")}</h3>
          <ul className="space-y-3">
            {notifications.slice(0, 6).map((n) => (
              <li key={n.id} className="flex items-start justify-between gap-3 border-b border-border/40 pb-3 last:border-none last:pb-0">
                <div>
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.message}</p>
                </div>
                <StatusBadge value={n.type} />
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-display text-base font-semibold">Unpaid invoices</h3>
          <ul className="space-y-3">
            {unpaid.map((i) => {
              const client = clients.find((c) => c.id === i.clientId);
              return (
                <li key={i.id} className="flex items-center justify-between gap-3 border-b border-border/40 pb-3 last:border-none last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{i.number}</p>
                    <p className="text-xs text-muted-foreground">{client?.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold tabular-nums">{money(i.amount)}</span>
                    <StatusBadge value={i.status} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </StaggerList>
    </div>
  );
}
