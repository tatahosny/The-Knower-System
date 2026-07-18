import { router } from "@inertiajs/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/auth";
import { ALL_ROLES, ROLE_LABELS, type Role } from "@/lib/permissions";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const { t } = useTranslation();
  
  const login = useAuth((s) => s.login);
  const [email, setEmail] = useState("admin@theknoweros.com"); // Matches the DB seed
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>("super_admin");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.visit(role === "client" ? "/portal" : "/dashboard" );
    } catch (error) {
      toast.error("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,color-mix(in_oklab,var(--primary)_20%,transparent),transparent_60%)]" />
      <div className="relative grid w-full max-w-5xl gap-8 md:grid-cols-[1.05fr_1fr]">
        <div className="hidden flex-col justify-between rounded-2xl border border-border bg-card/60 p-10 md:flex">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="font-display text-lg font-bold">K</span>
            </div>
            <div>
              <div className="font-display text-lg font-semibold leading-none">The Knower OS</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {t("app.tagline")}
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold leading-tight text-foreground">
              One system for the entire software house.
            </h2>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              CRM, projects, hosting, invoicing, HR, support and an AI copilot — under
              a single roof, in English & العربية.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              {[
                "12 role-based dashboards",
                "Full project lifecycle from lead to launch",
                "Hosting, domains & SSL renewals in one place",
                "Client portal for approvals and invoices",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-xs text-muted-foreground">© The Knower System</div>
        </div>

        <form
          onSubmit={submit}
          className="rounded-2xl border border-border bg-card p-8 shadow-xl"
        >
          <h1 className="font-display text-2xl font-semibold">{t("auth.signIn")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("auth.roleDemoNote")}</p>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("auth.chooseRole")}</Label>
              <div className="grid grid-cols-2 gap-2">
                {ALL_ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={
                      "rounded-md border px-3 py-2 text-start text-xs transition-colors " +
                      (role === r
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground")
                    }
                  >
                    {ROLE_LABELS[r]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button type="submit" className="mt-6 w-full">
            {t("auth.signInAs")} {ROLE_LABELS[role]}
          </Button>
        </form>
      </div>
    </div>
  );
}
