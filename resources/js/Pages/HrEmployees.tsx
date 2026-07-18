import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, add } from "@/mocks/store";
import { makeId, type Employee } from "@/mocks/data";
import { money, shortDate } from "@/lib/format";

export default function EmployeesPage() {
  const { t } = useTranslation();
  const rows = useCollection("employees");
  return (
    <ResourcePage<Employee>
      title={t("nav.employees")}
      description="Team roster"
      rows={rows}
      newLabel="New employee"
      columns={[
        { key: "name", header: t("common.name"), cell: (r) => <div><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.email}</div></div> },
        { key: "dept", header: "Department", cell: (r) => r.department },
        { key: "position", header: "Position", cell: (r) => r.position },
        { key: "salary", header: "Salary", cell: (r) => <span className="tabular-nums">{money(r.salary)}</span> },
        { key: "hire", header: "Hired", cell: (r) => shortDate(r.hireDate) },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status} /> },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={(v) => {
            add("employees", {
              id: makeId("em"),
              name: v.name,
              email: v.email,
              department: v.department,
              position: v.position,
              salary: Number(v.salary || 0),
              hireDate: new Date().toISOString(),
              status: "active",
            });
            close();
          }}
          fields={[
            { name: "name", label: "Name", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "department", label: "Department", type: "text" },
            { name: "position", label: "Position", type: "text" },
            { name: "salary", label: "Salary (USD)", type: "number" },
          ]}
        />
      )}
    />
  );
}
