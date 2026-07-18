import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, add } from "@/mocks/store";
import { makeId, type Quotation } from "@/mocks/data";
import { money, shortDate } from "@/lib/format";

export default function QuotationsPage() {
  const { t } = useTranslation();
  const rows = useCollection("quotations");
  const clients = useCollection("clients");
  return (
    <ResourcePage<Quotation>
      title={t("nav.quotations")}
      description="Price proposals sent to clients"
      rows={rows}
      newLabel="New quotation"
      columns={[
        { key: "number", header: "Number", cell: (r) => <span className="font-mono text-xs">{r.number}</span> },
        { key: "client", header: "Client", cell: (r) => clients.find((c) => c.id === r.clientId)?.name ?? "—" },
        { key: "price", header: "Price", cell: (r) => <span className="tabular-nums">{money(r.price, r.currency)}</span> },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status} /> },
        { key: "valid", header: "Valid until", cell: (r) => shortDate(r.validUntil) },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={(v) => {
            const n = rows.length + 1;
            add("quotations", {
              id: makeId("qt"),
              number: `QT-2026-${String(n).padStart(3, "0")}`,
              clientId: v.clientId,
              price: Number(v.price || 0),
              currency: v.currency || "USD",
              status: (v.status as Quotation["status"]) || "draft",
              validUntil: v.validUntil ? new Date(v.validUntil).toISOString() : new Date().toISOString(),
              createdAt: new Date().toISOString(),
            });
            close();
          }}
          fields={[
            { name: "clientId", label: "Client", type: "select", options: clients.map((c) => ({ value: c.id, label: c.name })), required: true },
            { name: "price", label: "Price", type: "number", required: true },
            { name: "currency", label: "Currency", type: "text", defaultValue: "USD" },
            { name: "validUntil", label: "Valid until", type: "date" },
            {
              name: "status",
              label: "Status",
              type: "select",
              defaultValue: "draft",
              options: [
                { value: "draft", label: "Draft" },
                { value: "sent", label: "Sent" },
                { value: "accepted", label: "Accepted" },
                { value: "rejected", label: "Rejected" },
              ],
            },
          ]}
        />
      )}
    />
  );
}
