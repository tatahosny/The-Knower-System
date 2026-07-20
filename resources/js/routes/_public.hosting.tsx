import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, CTABand, PricingCard, FeatureCard } from "@/components/public/blocks";
import { hostingPlans } from "@/mocks/marketing";
import { Cloud, Server, Zap, Shield, HardDrive, Activity } from "lucide-react";

export const Route = createFileRoute("/_public/hosting")({
  head: () => ({
    meta: [
      { title: "Hosting & Cloud — The Knower" },
      { name: "description", content: "Managed hosting, cloud infrastructure, CDN, email and backups." },
    ],
  }),
  component: HostingPage,
});

function HostingPage() {
  return (
    <div>
      <PageHero eyebrow="Hosting & Cloud" title="Managed hosting, worry-free" subtitle="Cloud, servers, CDN, email and backups — one team, one bill." />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: <Cloud className="h-5 w-5" />, title: "Managed cloud", description: "Fully managed on AWS, Azure, GCP or Cloudflare." },
            { icon: <Server className="h-5 w-5" />, title: "Dedicated servers", description: "Bare-metal performance for demanding workloads." },
            { icon: <Zap className="h-5 w-5" />, title: "Global CDN", description: "200+ edge locations for instant delivery worldwide." },
            { icon: <Shield className="h-5 w-5" />, title: "DDoS protection", description: "Enterprise-grade WAF and DDoS mitigation." },
            { icon: <HardDrive className="h-5 w-5" />, title: "Backups", description: "Daily encrypted backups with 30-day retention." },
            { icon: <Activity className="h-5 w-5" />, title: "24/7 monitoring", description: "Real-time alerts, on-call engineers, SLA-backed." },
          ].map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
      </Section>
      <Section className="bg-muted/30">
        <h2 className="font-display text-2xl font-semibold">Hosting plans</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {hostingPlans.map((p) => <PricingCard key={p.name} plan={p} cycle="monthly" />)}
        </div>
      </Section>
      <CTABand title="Need a custom architecture?" primary={{ label: "Talk to a cloud engineer", to: "/contact" }} />
    </div>
  );
}
