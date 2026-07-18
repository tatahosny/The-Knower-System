import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { useCollection, add } from "@/mocks/store";
import { makeId, type Contact } from "@/mocks/data";

export default function ContactsPage() {
  const { t } = useTranslation();
  const rows = useCollection("contacts");
  const companies = useCollection("companies");
  return (
    <ResourcePage<Contact>
      title={t("nav.contacts")}
      description="Named people inside client companies"
      rows={rows}
      newLabel="New contact"
      columns={[
        { key: "name", header: t("common.name"), cell: (r) => <span className="font-medium">{r.name}</span> },
        { key: "email", header: t("common.email"), cell: (r) => <span className="text-muted-foreground">{r.email}</span> },
        { key: "phone", header: t("common.phone"), cell: (r) => r.phone },
        { key: "company", header: "Company", cell: (r) => companies.find((c) => c.id === r.companyId)?.name ?? "—" },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={(v) => {
            add("contacts", {
              id: makeId("cn"),
              name: v.name,
              email: v.email,
              phone: v.phone,
              companyId: v.companyId || companies[0]?.id || "",
            });
            close();
          }}
          fields={[
            { name: "name", label: "Name", type: "text", required: true },
            { name: "email", label: "Email", type: "email" },
            { name: "phone", label: "Phone", type: "text" },
            { name: "companyId", label: "Company", type: "select", options: companies.map((c) => ({ value: c.id, label: c.name })) },
          ]}
        />
      )}
    />
  );
}
