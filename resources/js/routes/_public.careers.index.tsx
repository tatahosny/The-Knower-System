import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section, CTABand, Card, Badge } from "@/components/public/blocks";
import { jobs } from "@/mocks/marketing";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_public/careers/")({
  head: () => ({ meta: [{ title: "Careers — The Knower" }, { name: "description", content: "Join a senior team building software the world uses." }] }),
  component: () => {
    const [dept, setDept] = useState("All");
    const departments = ["All", ...Array.from(new Set(jobs.map((j) => j.department)))];
    const filtered = dept === "All" ? jobs : jobs.filter((j) => j.department === dept);
    return (
      <div>
        <PageHero eyebrow="Careers" title="Build things that matter" subtitle="Remote-first, senior-heavy, product-obsessed." />
        <Section>
          <div className="grid gap-6 md:grid-cols-4">
            {[["Remote-first", "Work from anywhere"], ["Senior teams", "Learn from the best"], ["Real ownership", "Ship end-to-end"], ["Growth budget", "Books, courses, conferences"]].map(([t, d]) => (
              <Card key={t}><div className="font-display text-base font-semibold">{t}</div><p className="mt-1 text-sm text-muted-foreground">{d}</p></Card>
            ))}
          </div>
        </Section>
        <Section className="bg-muted/30">
          <div className="mb-6 flex flex-wrap gap-2">
            {departments.map((d) => <Button key={d} size="sm" variant={dept === d ? "default" : "outline"} onClick={() => setDept(d)}>{d}</Button>)}
          </div>
          <div className="space-y-3">
            {filtered.map((j) => (
              <Link key={j.slug} to="/careers/$slug" params={{ slug: j.slug }}
                className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base font-semibold">{j.title}</h3>
                    <Badge>{j.level}</Badge>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {j.department}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {j.location}</span>
                    <span>· {j.type}</span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
            ))}
          </div>
        </Section>
        <CTABand title="Don't see your role?" subtitle="We're always meeting great people." primary={{ label: "Send us your CV", to: "/contact" }} />
      </div>
    );
  },
});
