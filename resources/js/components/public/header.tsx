import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, Languages, LogIn, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocaleStore } from "@/store/i18n";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/store/auth";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

const NAV: Array<{ label: string; to: string }> = [
  { label: "Solutions", to: "/solutions" },
  { label: "Products", to: "/products" },
  { label: "Services", to: "/services" },
  { label: "Pricing", to: "/pricing" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Company", to: "/about" },
];

const MORE: Array<{ label: string; to: string }> = [
  { label: "Case studies", to: "/case-studies" },
  { label: "Technologies", to: "/technologies" },
  { label: "AI Solutions", to: "/ai-solutions" },
  { label: "Hosting & Cloud", to: "/hosting" },
  { label: "Domains", to: "/domains" },
  { label: "Maintenance", to: "/maintenance" },
  { label: "Blog", to: "/blog" },
  { label: "Docs", to: "/docs" },
  { label: "Careers", to: "/careers" },
  { label: "Team", to: "/team" },
  { label: "Partners", to: "/partners" },
  { label: "Clients", to: "/clients" },
  { label: "Events", to: "/events" },
  { label: "Press", to: "/press" },
  { label: "Resources", to: "/resources" },
  { label: "Downloads", to: "/downloads" },
  { label: "Support", to: "/support" },
  { label: "FAQ", to: "/faq" },
  { label: "Status", to: "/status" },
  { label: "Contact", to: "/contact" },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const user = useAuth((s) => s.user);

  const switchLocale = () => {
    const next = locale === "en" ? "ar" : "en";
    setLocale(next);
    void i18n.changeLanguage(next);
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="font-display text-base font-bold">K</span>
          </div>
          <span className="font-display text-base font-semibold tracking-tight">The Knower</span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to as never}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "text-foreground" }}>
              {t(`public.nav.${n.label.toLowerCase()}`)}
            </Link>
          ))}
          <div className="relative">
            <button
              onClick={() => setMoreOpen((v) => !v)}
              onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >{t('public.nav.more')}</button>
            {moreOpen && (
              <div className="absolute end-0 top-full mt-1 grid w-[520px] grid-cols-2 gap-1 rounded-xl border border-border bg-popover p-3 shadow-xl">
                {MORE.map((m) => (
                  <Link key={m.to} to={m.to as never}
                    className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                    {/* Simplified for demo: just use the English label or add specific translations. For now fallback to label. */}
                    {t(`public.nav.${m.label.toLowerCase().replace(/ & /g, '').replace(/ /g, '')}`, { defaultValue: m.label })}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="ms-auto flex items-center gap-1.5">
          <Button variant="ghost" size="icon" className="hidden md:inline-flex" aria-label="Search">
            <Search className="h-4 w-4" />
          </Button>
          <ModeToggle />
          <Button variant="ghost" size="sm" onClick={switchLocale} className="gap-1 hidden md:inline-flex">
            <Languages className="h-4 w-4" /><span className="text-xs uppercase">{locale}</span>
          </Button>
          {user ? (
            <Button size="sm" onClick={() => window.location.href = "/dashboard"} className="gap-1.5">
              {t('public.nav.goToApp')} <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => window.location.href = "/login"} className="hidden sm:inline-flex gap-1.5">
                <LogIn className="h-4 w-4" /> {t('public.nav.signIn')}
              </Button>
              <Button size="sm" onClick={() => void navigate({ to: "/contact" })} className="gap-1.5 hidden sm:inline-flex">
                {t('public.nav.startProject')}
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className={cn("lg:hidden overflow-hidden border-t border-border transition-[max-height]", open ? "max-h-[70vh]" : "max-h-0")}>
        <div className="grid max-h-[70vh] grid-cols-2 gap-1 overflow-y-auto p-4">
          {[...NAV, ...MORE].map((n) => (
            <Link key={n.to} to={n.to as never} onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
              {t(`public.nav.${n.label.toLowerCase().replace(/ & /g, '').replace(/ /g, '')}`, { defaultValue: n.label })}
            </Link>
          ))}
          <button onClick={switchLocale} className="col-span-2 mt-2 flex items-center justify-center gap-2 rounded-md border border-border py-2 text-sm">
            <Languages className="h-4 w-4" /> {locale === "en" ? "العربية" : "English"}
          </button>
        </div>
      </div>
    </header>
  );
}
