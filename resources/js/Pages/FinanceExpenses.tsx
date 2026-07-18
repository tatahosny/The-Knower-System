import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { useCollection, add } from "@/mocks/store";
import { makeId, type Expense } from "@/mocks/data";
import { money, shortDate } from "@/lib/format";

export default function ExpensesPage() {
  const { t } = useTranslation();
  const rows = useCollection("expenses");
  return (
    <ResourcePage<Expense>
      title={t("nav.expenses")}
      description="Company costs and outflows"
      rows={rows}
      newLabel="New expense"
      columns={[
        { key: "title", header: t("common.title"), cell: (r) => <span className="font-medium">{r.title}</span> },
        { key: "category", header: "Category", cell: (r) => r.category },
        { key: "method", header: "Method", cell: (r) => r.method },
        { key: "amount", header: t("common.amount"), cell: (r) => <span className="font-semibold tabular-nums">{money(r.amount)}</span> },
        { key: "created", header: t("common.created"), cell: (r) => <span className="text-xs text-muted-foreground">{shortDate(r.createdAt)}</span> },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={(v) => {
            add("expenses", {
              id: makeId("ex"),
              category: v.category,
              title: v.title,
              amount: Number(v.amount || 0),
              method: v.method,
              createdAt: new Date().toISOString(),
            });
            close();
          }}
          fields={[
            { name: "title", label: "Title", type: "text", required: true },
            { name: "category", label: "Category", type: "text" },
            { name: "amount", label: "Amount", type: "number", required: true },
            { name: "method", label: "Method", type: "text", defaultValue: "card" },
          ]}
        />
      )}
    />
  );
}
