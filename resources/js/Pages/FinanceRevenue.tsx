import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { useCollection, seed } from "@/mocks/store";
import { money } from "@/lib/format";
import { DollarSign, TrendingUp, TrendingDown, Percent } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function RevenuePage() {
  const { t } = useTranslation();
  const invoices = useCollection("invoices");
  const paid = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const outstanding = invoices.filter((i) => i.status !== "paid").reduce((s, i) => s + i.amount, 0);
  const totalRev = seed.revenueSeries.reduce((s, r) => s + r.revenue, 0);
  const totalExp = seed.revenueSeries.reduce((s, r) => s + r.expense, 0);
  const margin = Math.round(((totalRev - totalExp) / totalRev) * 100);

  return (
    <div className="space-y-6">
      <PageHeader title={t("nav.revenue")} description="Revenue vs expenses over time" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Paid this period" value={money(paid)} icon={DollarSign} accent="success" />
        <StatCard label="Outstanding" value={money(outstanding)} icon={TrendingDown} accent="warning" />
        <StatCard label="Total revenue" value={money(totalRev)} icon={TrendingUp} accent="primary" />
        <StatCard label="Gross margin" value={`${margin}%`} icon={Percent} accent="success" />
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 font-display text-base font-semibold">Revenue vs expenses</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={seed.revenueSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                formatter={(v) => money(Number(v))}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="revenue" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" fill="var(--chart-3)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
