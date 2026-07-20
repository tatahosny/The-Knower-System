import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, CTABand, PricingCard, FeatureCard } from "@/components/public/blocks";
import { maintenancePlans } from "@/mocks/marketing";
import { Wrench, Shield, Activity, RefreshCw, Bug, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_public/maintenance")({
  head: () => ({
    meta: [
      { title: "Maintenance Plans — The Knower" },
      { name: "description", content: "Keep your software fast, secure and continuously improving." },
    ],
  }),
  component: MaintenancePage,
});

function MaintenancePage() {
  return (
    <div>
      <PageHero eyebrow="Maintenance" title="Software that keeps getting better" subtitle="Security patches, performance tuning, bug fixes and continuous improvement." />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: <Shield className="h-5 w-5" />, title: "Security patches", description: "Weekly patching for OS, framework and dependencies." },
            { icon: <Activity className="h-5 w-5" />, title: "24/7 monitoring", description: "Uptime, performance and error tracking." },
            { icon: <RefreshCw className="h-5 w-5" />, title: "Daily backups", description: "Encrypted, tested, geo-redundant." },
            { icon: <Wrench className="h-5 w-5" />, title: "Updates", description: "Framework and library upgrades handled for you." },
            { icon: <Bug className="h-5 w-5" />, title: "Bug fixes", description: "SLA-backed response and resolution times." },
            { icon: <TrendingUp className="h-5 w-5" />, title: "Performance", description: "Quarterly performance audits and optimization." },
          ].map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
      </Section>
      <Section className="bg-muted/30">
        <h2 className="font-display text-2xl font-semibold">Maintenance plans</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {maintenancePlans.map((p) => <PricingCard key={p.name} plan={p} cycle="monthly" />)}
        </div>
      </Section>
      <CTABand title="Emergency support needed?" subtitle="24/7 hotline for critical issues." primary={{ label: "Contact support", to: "/support" }} />
    </div>
  );
}
