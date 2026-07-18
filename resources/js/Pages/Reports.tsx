import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { useCollection, seed } from "@/mocks/store";
import { money } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText, TrendingUp, Users, FolderKanban, UsersRound } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const reports = [
  { key: "sales", label: "Sales report", icon: TrendingUp, description: "Leads, quotes, and conversion" },
  { key: "finance", label: "Finance report", icon: FileText, description: "Revenue, expenses, and margin" },
  { key: "clients", label: "Clients report", icon: Users, description: "Growth and retention" },
  { key: "projects", label: "Projects report", icon: FolderKanban, description: "Delivery and health" },
  { key: "employees", label: "Employees report", icon: UsersRound, description: "Team performance and load" },
];

export default function ReportsPage() {
  const { t } = useTranslation();
  const clients = useCollection("clients");
  const projects = useCollection("projects");
  const employees = useCollection("employees");
  const revenue = seed.revenueSeries.reduce((s, r) => s + r.revenue, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("nav.reports")}
        description="Business insight across every module"
        actions={
          <>
            <Button variant="outline"><FileSpreadsheet className="me-1 h-4 w-4" />Excel</Button>
            <Button variant="outline"><Download className="me-1 h-4 w-4" />PDF</Button>
          </>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total revenue" value={money(revenue)} icon={TrendingUp} accent="success" />
        <StatCard label="Clients" value={clients.length} icon={Users} />
        <StatCard label="Projects" value={projects.length} icon={FolderKanban} />
        <StatCard label="Employees" value={employees.length} icon={UsersRound} />
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 font-display text-base font-semibold">Revenue trend</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={seed.revenueSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} formatter={(v) => money(Number(v))} />
              <Line type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <div key={r.key} className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
            <div className="flex items-start justify-between">
              <div className="rounded-lg bg-primary/10 p-2 text-primary"><r.icon className="h-5 w-5" /></div>
              <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
            </div>
            <h4 className="mt-4 font-display font-semibold">{r.label}</h4>
            <p className="mt-1 text-xs text-muted-foreground">{r.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
