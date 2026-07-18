import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, add } from "@/mocks/store";
import { makeId, type Domain } from "@/mocks/data";
import { shortDate } from "@/lib/format";

export default function DomainsPage() {
  const { t } = useTranslation();
  const rows = useCollection("domains");
  const clients = useCollection("clients");
  return (
    <ResourcePage<Domain>
      title={t("nav.domains")}
      description="Registered domains & renewals"
      rows={rows}
      newLabel="Add domain"
      columns={[
        { key: "domain", header: "Domain", cell: (r) => <span className="font-mono">{r.domain}</span> },
        { key: "client", header: "Client", cell: (r) => clients.find((c) => c.id === r.clientId)?.name ?? "—" },
        { key: "registrar", header: "Registrar", cell: (r) => r.registrar },
        { key: "expiry", header: "Expires", cell: (r) => shortDate(r.expiryDate) },
        { key: "auto", header: "Auto-renew", cell: (r) => (r.autoRenew ? "Yes" : "No") },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status} /> },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={(v) => {
            add("domains", {
              id: makeId("dm"),
              clientId: v.clientId,
              domain: v.domain,
              registrar: v.registrar || "Namecheap",
              expiryDate: v.expiryDate ? new Date(v.expiryDate).toISOString() : new Date().toISOString(),
              autoRenew: v.autoRenew === "yes",
              status: "active",
            });
            close();
          }}
          fields={[
            { name: "domain", label: "Domain", type: "text", required: true },
            { name: "clientId", label: "Client", type: "select", options: clients.map((c) => ({ value: c.id, label: c.name })) },
            { name: "registrar", label: "Registrar", type: "text", defaultValue: "Namecheap" },
            { name: "expiryDate", label: "Expires", type: "date" },
            { name: "autoRenew", label: "Auto-renew", type: "select", defaultValue: "yes", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }] },
          ]}
        />
      )}
    />
  );
}
