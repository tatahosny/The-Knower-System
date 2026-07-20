import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const COLUMNS: Array<{ title: string; links: Array<{ label: string; to: string }> }> = [
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" }, { label: "Team", to: "/team" },
      { label: "Careers", to: "/careers" }, { label: "Partners", to: "/partners" },
      { label: "Press", to: "/press" }, { label: "Events", to: "/events" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Solutions", to: "/solutions" }, { label: "Products", to: "/products" },
      { label: "Services", to: "/services" }, { label: "AI Solutions", to: "/ai-solutions" },
      { label: "Technologies", to: "/technologies" }, { label: "Portfolio", to: "/portfolio" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Hosting & Cloud", to: "/hosting" }, { label: "Domains", to: "/domains" },
      { label: "Maintenance", to: "/maintenance" }, { label: "Pricing", to: "/pricing" },
      { label: "Case studies", to: "/case-studies" }, { label: "Clients", to: "/clients" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", to: "/blog" }, { label: "Docs", to: "/docs" },
      { label: "Resources", to: "/resources" }, { label: "Downloads", to: "/downloads" },
      { label: "Support", to: "/support" }, { label: "FAQ", to: "/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", to: "/legal/privacy" }, { label: "Terms", to: "/legal/terms" },
      { label: "Cookies", to: "/legal/cookies" }, { label: "Status", to: "/status" },
      { label: "Contact", to: "/contact" },
    ],
  },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(5,1fr)]">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="font-display text-base font-bold">K</span>
              </div>
              <span className="font-display text-base font-semibold">The Knower</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The operating system for modern software houses. Ship products, run operations, delight clients.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex gap-2">
              <Input type="email" placeholder="Your email" className="h-9" />
              <Button type="submit" size="sm">Subscribe</Button>
            </form>
            <div className="mt-6 flex gap-2">
              {[Twitter, Linkedin, Github, Youtube].map((I, i) => (
                <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
                  <I className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 font-display text-sm font-semibold">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to as never} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} The Knower System. All rights reserved.</div>
          <div className="flex gap-4">
            <Link to="/legal/privacy">Privacy</Link>
            <Link to="/legal/terms">Terms</Link>
            <Link to="/legal/cookies">Cookies</Link>
            <Link to="/status">Status</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
