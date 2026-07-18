import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { useCollection, add } from "@/mocks/store";
import { makeId, type Department } from "@/mocks/data";

export default function DepartmentsPage() {
  const { t } = useTranslation();
  const rows = useCollection("departments");
  return (
    <ResourcePage<Department>
      title={t("nav.departments")}
      description="Company org chart"
      rows={rows}
      newLabel="New department"
      columns={[
        { key: "name", header: t("common.name"), cell: (r) => <span className="font-medium">{r.name}</span> },
        { key: "head", header: "Head", cell: (r) => r.head },
        { key: "count", header: "Employees", cell: (r) => r.employeeCount },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={(v) => {
            add("departments", { id: makeId("dp"), name: v.name, head: v.head, employeeCount: Number(v.employeeCount || 0) });
            close();
          }}
          fields={[
            { name: "name", label: "Department name", type: "text", required: true },
            { name: "head", label: "Head", type: "text" },
            { name: "employeeCount", label: "Employee count", type: "number", defaultValue: 0 },
          ]}
        />
      )}
    />
  );
}
