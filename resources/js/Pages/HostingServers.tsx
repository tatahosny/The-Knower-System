import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, add } from "@/mocks/store";
import { makeId, type Server as ServerT } from "@/mocks/data";

export default function ServersPage() {
  const { t } = useTranslation();
  const rows = useCollection("servers");
  return (
    <ResourcePage<ServerT>
      title={t("nav.servers")}
      description="Provisioned infrastructure"
      rows={rows}
      newLabel="Add server"
      columns={[
        { key: "name", header: t("common.name"), cell: (r) => <span className="font-medium">{r.name}</span> },
        { key: "provider", header: "Provider", cell: (r) => r.provider },
        { key: "ip", header: "IP", cell: (r) => <span className="font-mono text-xs">{r.ip}</span> },
        { key: "location", header: "Location", cell: (r) => r.location },
        { key: "os", header: "OS", cell: (r) => r.os },
        { key: "status", header: t("common.status"), cell: (r) => <StatusBadge value={r.status} /> },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={(v) => {
            add("servers", {
              id: makeId("sv"),
              name: v.name,
              provider: v.provider,
              ip: v.ip,
              location: v.location,
              os: v.os || "Ubuntu 24.04",
              status: "online",
            });
            close();
          }}
          fields={[
            { name: "name", label: "Name", type: "text", required: true },
            { name: "provider", label: "Provider", type: "text" },
            { name: "ip", label: "IP", type: "text" },
            { name: "location", label: "Location", type: "text" },
            { name: "os", label: "OS", type: "text", defaultValue: "Ubuntu 24.04" },
          ]}
        />
      )}
    />
  );
}
