import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, add } from "@/mocks/store";
import { makeId, type Contract } from "@/mocks/data";
import { shortDate } from "@/lib/format";

export default function ContractsPage() {
  const { t } = useTranslation();
  const rows = useCollection("contracts");
  const clients = useCollection("clients");
  return (
    <ResourcePage<Contract>
      title={t("nav.contracts")}
      description="Signed engagements"
      rows={rows}
      newLabel="New contract"
      columns={[
        { key: "number", header: "Number", cell: (r) => <span className="font-mono text-xs">{r.number}</span> },
        { key: "client", header: "Client", cell: (r) => clients.find((c) => c.id === r.clientId)?.name ?? "—" },
        { key: "start", header: "Start", cell: (r) => shortDate(r.startDate) },
        { key: "end", header: "End", cell: (r) => shortDate(r.endDate) },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status} /> },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={(v) => {
            const n = rows.length + 1;
            add("contracts", {
              id: makeId("ct"),
              number: `CTR-2026-${String(n).padStart(3, "0")}`,
              clientId: v.clientId,
              startDate: v.startDate ? new Date(v.startDate).toISOString() : new Date().toISOString(),
              endDate: v.endDate ? new Date(v.endDate).toISOString() : new Date().toISOString(),
              status: (v.status as Contract["status"]) || "draft",
              createdAt: new Date().toISOString(),
            });
            close();
          }}
          fields={[
            { name: "clientId", label: "Client", type: "select", options: clients.map((c) => ({ value: c.id, label: c.name })), required: true },
            { name: "startDate", label: "Start", type: "date" },
            { name: "endDate", label: "End", type: "date" },
            {
              name: "status",
              label: "Status",
              type: "select",
              defaultValue: "draft",
              options: [
                { value: "draft", label: "Draft" },
                { value: "active", label: "Active" },
                { value: "ended", label: "Ended" },
              ],
            },
          ]}
        />
      )}
    />
  );
}
