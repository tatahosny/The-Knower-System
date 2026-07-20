import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { PageHero, Section, CTABand, Card, Badge } from "@/components/public/blocks";
import { services } from "@/mocks/marketing";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const Route = createFileRoute("/_public/services/$slug")({
  loader: ({ params }) => {
    const s = services.find((x) => x.slug === params.slug);
    if (!s) throw notFound();
    return s;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Service"} — The Knower` },
      { name: "description", content: loaderData?.description ?? "" },
    ],
  }),
  component: ServicePage,
});

function ServicePage() {
  const s = Route.useLoaderData();
  return (
    <div>
      <PageHero eyebrow="Service" title={s.name} subtitle={s.tagline}
        actions={<Button asChild size="lg"><Link to="/contact">Get a quote</Link></Button>} />
      <Section>
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <Badge>What you get</Badge>
            <h2 className="mt-3 font-display text-2xl font-semibold">Deliverables</h2>
            <p className="mt-3 text-muted-foreground">{s.description}</p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {s.deliverables.map((d: string) => (
                <li key={d} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{d}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3 className="font-display text-base font-semibold">Our process</h3>
            <ol className="mt-3 space-y-3 text-sm">
              {["Discovery workshop", "Proposal & fixed price", "Sprint delivery", "Launch & handover", "Ongoing support"].map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </Section>
      <CTABand title="Let's talk timelines" primary={{ label: "Book a call", to: "/contact" }} secondary={{ label: "See portfolio", to: "/portfolio" }} />
    </div>
  );
}
