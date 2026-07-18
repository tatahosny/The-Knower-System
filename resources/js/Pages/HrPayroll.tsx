import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { useCollection } from "@/mocks/store";
import { money } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function PayrollPage() {
  const { t } = useTranslation();
  const employees = useCollection("employees");
  const total = employees.reduce((s, e) => s + e.salary, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("nav.payroll")}
        description={`Monthly total: ${money(total)}`}
        actions={
          <Button variant="outline">
            <Download className="me-1 h-4 w-4" />
            Export payroll
          </Button>
        }
      />
      <DataTable
        rows={employees}
        columns={[
          { key: "name", header: t("common.name"), cell: (r) => <span className="font-medium">{r.name}</span> },
          { key: "department", header: "Department", cell: (r) => r.department },
          { key: "position", header: "Position", cell: (r) => r.position },
          { key: "salary", header: "Salary", cell: (r) => <span className="font-semibold tabular-nums">{money(r.salary)}</span> },
          { key: "status", header: "Status", cell: (r) => <StatusBadge value={r.status} /> },
        ]}
      />
    </div>
  );
}
