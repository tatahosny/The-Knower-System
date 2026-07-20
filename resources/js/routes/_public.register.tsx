import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageHero, Section, Card } from "@/components/public/blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_public/register")({
  head: () => ({ meta: [{ title: "Create account — The Knower" }, { name: "description", content: "Create your account to access The Knower OS." }] }),
  component: () => {
    const navigate = useNavigate();
    return (
      <div>
        <PageHero eyebrow="Get started" title="Create your account" subtitle="Free 14-day trial. No credit card required." />
        <Section>
          <div className="mx-auto max-w-md">
            <Card>
              <form onSubmit={(e) => { e.preventDefault(); toast.success("Account created — sign in to continue."); window.location.href = "/login"; }} className="space-y-4">
                <div><Label>Full name</Label><Input required /></div>
                <div><Label>Work email</Label><Input type="email" required /></div>
                <div><Label>Company</Label><Input required /></div>
                <div><Label>Password</Label><Input type="password" required /></div>
                <Button type="submit" size="lg" className="w-full">Create account</Button>
                <p className="text-center text-xs text-muted-foreground">
                  Already have an account? <a href="/login" className="text-primary">Sign in</a>
                </p>
              </form>
            </Card>
          </div>
        </Section>
      </div>
    );
  },
});
