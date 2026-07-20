import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageHero, Section, Card, Badge } from "@/components/public/blocks";
import { jobs } from "@/mocks/marketing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Check } from "lucide-react";

export const Route = createFileRoute("/_public/careers/$slug")({
  loader: ({ params }) => { const j = jobs.find((x) => x.slug === params.slug); if (!j) throw notFound(); return j; },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.title ?? "Job"} — Careers at The Knower` }, { name: "description", content: loaderData?.summary ?? "" }],
    scripts: loaderData ? [{
      type: "application/ld+json",
      children: JSON.stringify({ "@context": "https://schema.org", "@type": "JobPosting", title: loaderData.title, employmentType: loaderData.type, jobLocation: { "@type": "Place", address: loaderData.location }, description: loaderData.summary }),
    }] : [],
  }),
  component: () => {
    const j = Route.useLoaderData();
    return (
      <div>
        <PageHero eyebrow={j.department} title={j.title} subtitle={`${j.location} · ${j.type} · ${j.level}`} />
        <Section>
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-6">
              <Card><h2 className="font-display text-xl font-semibold">About the role</h2><p className="mt-3 text-muted-foreground">{j.summary}</p></Card>
              <Card>
                <h3 className="font-display text-base font-semibold">Requirements</h3>
                <ul className="mt-3 space-y-2 text-sm">{j.requirements.map((r: string) => <li key={r} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{r}</li>)}</ul>
              </Card>
              <Card>
                <h3 className="font-display text-base font-semibold">Benefits</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">{j.benefits.map((b: string) => <Badge key={b}>{b}</Badge>)}</div>
              </Card>
            </div>
            <Card>
              <h3 className="font-display text-base font-semibold">Apply now</h3>
              <form onSubmit={(e) => { e.preventDefault(); toast.success("Application received — we'll be in touch."); }} className="mt-4 space-y-3">
                <div><Label>Full name</Label><Input required /></div>
                <div><Label>Email</Label><Input type="email" required /></div>
                <div><Label>LinkedIn / portfolio</Label><Input /></div>
                <div><Label>CV (mock upload)</Label><Input type="file" /></div>
                <div><Label>Why us?</Label><Textarea rows={3} /></div>
                <Button type="submit" className="w-full">Submit application</Button>
              </form>
            </Card>
          </div>
        </Section>
      </div>
    );
  },
});
