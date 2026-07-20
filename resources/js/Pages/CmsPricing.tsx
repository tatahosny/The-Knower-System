import { ResourcePage } from "@/components/resource-page";
import { QuickForm } from "@/components/quick-form";
import { useCollection, add } from "@/mocks/store";

export default function CmsPricingPage() {
  const rows = useCollection("marketingPlans");

  return (
    <ResourcePage
      title="Pricing Plans"
      description="Manage pricing plans and features"
      rows={rows}
      newLabel="New Plan"
      columns={[
        { key: "name", header: "Name", cell: (r: any) => r.name },
        { key: "price_monthly", header: "Monthly", cell: (r: any) => r.priceMonthly },
        { key: "price_yearly", header: "Yearly", cell: (r: any) => r.priceYearly },
        { key: "is_active", header: "Active", cell: (r: any) => r.isActive ? "Yes" : "No" },
      ]}
      renderForm={(close) => (
        <QuickForm
          onCancel={close}
          onSubmit={async (v) => {
            try {
              await add("marketingPlans", { ...{"isActive":true,"isPopular":false,"features":[]}, ...v });
              close();
            } catch (err: any) {
              alert(err.response?.data?.message || "Failed to save plan.");
            }
          }}
          fields={[
            { name: "name", label: "Plan Name", type: "text" , required: true },
            { name: "description", label: "Description", type: "textarea"  },
            { name: "price_monthly", label: "Monthly Price", type: "text"  },
            { name: "price_yearly", label: "Yearly Price", type: "text"  },
          ]}
        />
      )}
    />
  );
}