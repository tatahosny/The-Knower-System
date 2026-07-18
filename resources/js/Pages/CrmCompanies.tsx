import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { useCollection, add } from "@/mocks/store";
import { makeId, type Company } from "@/mocks/data";
import { shortDate } from "@/lib/format";

export default function CompaniesPage() {
  const { t } = useTranslation();
  const rows = useCollection("companies");
  return (
    <ResourcePage<Company>
      title={t("nav.companies")}
      description="Client organizations"
      rows={rows}
      newLabel="New company"
      columns={[
        { key: "name", header: t("common.name"), cell: (r) => <span className="font-medium">{r.name}</span> },
        { key: "industry", header: "Industry", cell: (r) => r.industry },
        { key: "website", header: "Website", cell: (r) => <span className="text-muted-foreground">{r.website}</span> },
        { key: "country", header: "Country", cell: (r) => r.country },
        { key: "created", header: t("common.created"), cell: (r) => <span className="text-xs text-muted-foreground">{shortDate(r.createdAt)}</span> },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={(v) => {
            add("companies", {
              id: makeId("co"),
              name: v.name,
              industry: v.industry,
              website: v.website,
              country: v.country,
              createdAt: new Date().toISOString(),
            });
            close();
          }}
          fields={[
            { name: "name", label: "Company name", type: "text", required: true },
            { name: "industry", label: "Industry", type: "text" },
            { name: "website", label: "Website", type: "text" },
            { name: "country", label: "Country", type: "text" },
          ]}
        />
      )}
    />
  );
}
