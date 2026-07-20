import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section, CTABand, Badge } from "@/components/public/blocks";
import { portfolio as staticPortfolio } from "@/mocks/marketing";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const Route = createFileRoute("/_public/portfolio/")({
  head: () => ({
    meta: [
      { title: "Portfolio — The Knower" },
      { name: "description", content: "Selected work: healthcare, retail, fintech, government, logistics and more." },
    ],
    links: [{ rel: "canonical", href: "https://knower-all-in-one.lovable.app/portfolio" }],
  }),
  component: PortfolioIndex,
});

function PortfolioIndex() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const { data: dynamicPortfolio } = useQuery({
    queryKey: ['public', 'portfolio'],
    queryFn: async () => {
      const res = await axios.get('/api/v1/public/portfolio');
      return res.data.projects.map((p: any) => ({
        slug: p.id.toString(), title: p.name, category: p.public_category || "App", client: "Client", year: new Date(p.created_at).getFullYear(), cover: "hero-app", summary: p.public_summary || p.description
      }));
    }
  });
  const portfolio = dynamicPortfolio || staticPortfolio;

  const categories = useMemo(() => ["All", ...Array.from(new Set(portfolio.map((p: any) => p.category)))], [portfolio]);
  const filtered = portfolio.filter((p: any) => (cat === "All" || p.category === cat) && (q === "" || p.title.toLowerCase().includes(q.toLowerCase())));
  return (
    <div>
      <PageHero eyebrow="Portfolio" title="Work we're proud of" subtitle="500+ projects delivered. Here's a curated selection." />
      <Section>
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <Input placeholder="Search projects…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c: any) => (
              <Button key={c} size="sm" variant={cat === c ? "default" : "outline"} onClick={() => setCat(c)}>{c}</Button>
            ))}
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p: any) => (
            <Link key={p.slug} to="/portfolio/$slug" params={{ slug: p.slug }}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/50">
              <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-primary/25 via-primary/10 to-accent/20">
                <span className="font-display text-4xl font-bold text-primary/40">{p.client.split(" ").map((w: any) => w[0]).join("")}</span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <Badge>{p.category}</Badge><span>{p.year}</span>
                </div>
                <div className="mt-2 font-display text-base font-semibold">{p.title}</div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.summary}</p>
              </div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">No projects match.</div>}
      </Section>
      <CTABand title="Your project could be next" primary={{ label: "Start a project", to: "/contact" }} />
    </div>
  );
}
