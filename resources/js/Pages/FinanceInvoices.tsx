import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, add } from "@/mocks/store";
import { makeId, type Invoice } from "@/mocks/data";
import { money, shortDate } from "@/lib/format";

export default function InvoicesPage() {
  const { t } = useTranslation();
  const rows = useCollection("invoices");
  const clients = useCollection("clients");
  const projects = useCollection("projects");
  return (
    <ResourcePage<Invoice>
      title={t("nav.invoices")}
      description="Bills issued to clients"
      rows={rows}
      newLabel="New invoice"
      columns={[
        { key: "number", header: "Number", cell: (r) => <span className="font-mono text-xs">{r.number}</span> },
        { key: "client", header: "Client", cell: (r) => clients.find((c) => c.id === r.clientId)?.name ?? "—" },
        { key: "project", header: "Project", cell: (r) => projects.find((p) => p.id === r.projectId)?.name ?? "—" },
        { key: "amount", header: t("common.amount"), cell: (r) => <span className="font-semibold tabular-nums">{money(r.amount)}</span> },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status} /> },
        { key: "due", header: "Due", cell: (r) => shortDate(r.dueDate) },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={(v) => {
            const n = rows.length + 1;
            add("invoices", {
              id: makeId("in"),
              number: `INV-2026-${String(n).padStart(3, "0")}`,
              clientId: v.clientId,
              projectId: v.projectId,
              amount: Number(v.amount || 0),
              status: (v.status as Invoice["status"]) || "draft",
              dueDate: v.dueDate ? new Date(v.dueDate).toISOString() : new Date().toISOString(),
              createdAt: new Date().toISOString(),
            });
            close();
          }}
          fields={[
            { name: "clientId", label: "Client", type: "select", options: clients.map((c) => ({ value: c.id, label: c.name })), required: true },
            { name: "projectId", label: "Project", type: "select", options: projects.map((p) => ({ value: p.id, label: p.name })) },
            { name: "amount", label: "Amount (USD)", type: "number", required: true },
            { name: "dueDate", label: "Due date", type: "date" },
            {
              name: "status",
              label: "Status",
              type: "select",
              defaultValue: "draft",
              options: [
                { value: "draft", label: "Draft" },
                { value: "sent", label: "Sent" },
                { value: "paid", label: "Paid" },
                { value: "overdue", label: "Overdue" },
              ],
            },
          ]}
        />
      )}
    />
  );
}
