import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { useCollection, add } from "@/mocks/store";
import { makeId, type Meeting } from "@/mocks/data";
import { shortDate } from "@/lib/format";

export default function MeetingsPage() {
  const { t } = useTranslation();
  const rows = useCollection("meetings");
  const clients = useCollection("clients");
  return (
    <ResourcePage<Meeting>
      title={t("nav.meetings")}
      description="Scheduled calls & workshops"
      rows={rows}
      newLabel="New meeting"
      columns={[
        { key: "title", header: t("common.title"), cell: (r) => <span className="font-medium">{r.title}</span> },
        { key: "client", header: "Client", cell: (r) => clients.find((c) => c.id === r.clientId)?.name ?? "—" },
        { key: "date", header: t("common.date"), cell: (r) => shortDate(r.date) },
        { key: "duration", header: "Duration", cell: (r) => `${r.duration} min` },
        { key: "attendees", header: "Attendees", cell: (r) => r.attendees },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={(v) => {
            add("meetings", {
              id: makeId("mt"),
              title: v.title,
              clientId: v.clientId,
              date: v.date ? new Date(v.date).toISOString() : new Date().toISOString(),
              duration: Number(v.duration || 30),
              attendees: v.attendees,
            });
            close();
          }}
          fields={[
            { name: "title", label: "Title", type: "text", required: true },
            { name: "clientId", label: "Client", type: "select", options: clients.map((c) => ({ value: c.id, label: c.name })) },
            { name: "date", label: "Date", type: "date" },
            { name: "duration", label: "Duration (min)", type: "number", defaultValue: 30 },
            { name: "attendees", label: "Attendees", type: "text" },
          ]}
        />
      )}
    />
  );
}
