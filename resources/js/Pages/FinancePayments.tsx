import { useTranslation } from "react-i18next";
import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, add } from "@/mocks/store";
import { makeId, type Payment } from "@/mocks/data";
import { money, shortDate } from "@/lib/format";

export default function PaymentsPage() {
  const { t } = useTranslation();
  const rows = useCollection("payments");
  const invoices = useCollection("invoices");
  return (
    <ResourcePage<Payment>
      title={t("nav.payments")}
      description="Payments received against invoices"
      rows={rows}
      newLabel="Record payment"
      columns={[
        { key: "invoice", header: "Invoice", cell: (r) => <span className="font-mono text-xs">{invoices.find((i) => i.id === r.invoiceId)?.number ?? r.invoiceId}</span> },
        { key: "method", header: "Method", cell: (r) => <StatusBadge value={r.method} /> },
        { key: "amount", header: t("common.amount"), cell: (r) => <span className="font-semibold tabular-nums">{money(r.amount)}</span> },
        { key: "paid", header: "Paid at", cell: (r) => shortDate(r.paidAt) },
        { key: "ref", header: "Reference", cell: (r) => <span className="text-xs text-muted-foreground">{r.reference}</span> },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={(v) => {
            add("payments", {
              id: makeId("py"),
              invoiceId: v.invoiceId,
              method: (v.method as Payment["method"]) || "bank",
              amount: Number(v.amount || 0),
              paidAt: v.paidAt ? new Date(v.paidAt).toISOString() : new Date().toISOString(),
              reference: v.reference,
            });
            close();
          }}
          fields={[
            { name: "invoiceId", label: "Invoice", type: "select", options: invoices.map((i) => ({ value: i.id, label: i.number })), required: true },
            { name: "amount", label: "Amount", type: "number", required: true },
            {
              name: "method",
              label: "Method",
              type: "select",
              defaultValue: "bank",
              options: [
                { value: "card", label: "Card" },
                { value: "bank", label: "Bank transfer" },
                { value: "cash", label: "Cash" },
                { value: "wallet", label: "Wallet" },
              ],
            },
            { name: "paidAt", label: "Paid at", type: "date" },
            { name: "reference", label: "Reference", type: "text" },
          ]}
        />
      )}
    />
  );
}
