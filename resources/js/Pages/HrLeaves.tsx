import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, add } from "@/mocks/store";
import { makeId, type Leave } from "@/mocks/data";
import { shortDate } from "@/lib/format";

export default function LeavesPage() {
  const { t } = useTranslation();
  const rows = useCollection("leaves");
  const employees = useCollection("employees");
  return (
    <ResourcePage<Leave>
      title={t("nav.leaves")}
      description="Time off requests"
      rows={rows}
      newLabel="Request leave"
      columns={[
        { key: "employee", header: "Employee", cell: (r) => employees.find((e) => e.id === r.employeeId)?.name ?? "—" },
        { key: "type", header: "Type", cell: (r) => <StatusBadge value={r.type} /> },
        { key: "start", header: "Start", cell: (r) => shortDate(r.startDate) },
        { key: "end", header: "End", cell: (r) => shortDate(r.endDate) },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status} /> },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={(v) => {
            add("leaves", {
              id: makeId("lv"),
              employeeId: v.employeeId,
              type: (v.type as Leave["type"]) || "annual",
              startDate: v.startDate ? new Date(v.startDate).toISOString() : new Date().toISOString(),
              endDate: v.endDate ? new Date(v.endDate).toISOString() : new Date().toISOString(),
              status: "pending",
            });
            close();
          }}
          fields={[
            { name: "employeeId", label: "Employee", type: "select", options: employees.map((e) => ({ value: e.id, label: e.name })), required: true },
            {
              name: "type",
              label: "Type",
              type: "select",
              defaultValue: "annual",
              options: [
                { value: "annual", label: "Annual" },
                { value: "sick", label: "Sick" },
                { value: "unpaid", label: "Unpaid" },
              ],
            },
            { name: "startDate", label: "Start", type: "date" },
            { name: "endDate", label: "End", type: "date" },
          ]}
        />
      )}
    />
  );
}
