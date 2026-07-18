import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ROLE_LABELS, ROLE_PERMISSIONS, ALL_ROLES } from "@/lib/permissions";
import { StatusBadge } from "@/components/status-badge";

export default function SettingsPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <PageHeader title={t("nav.settings")} description="Company, security, integrations, and roles" />
      <Tabs defaultValue="company">
        <TabsList>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="smtp">SMTP</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6">
          <Row label="Company name" defaultValue="The Knower System" />
          <Row label="Website" defaultValue="theknowersystem.com" />
          <Row label="Tax number" defaultValue="123-456-789" />
          <Row label="Address" defaultValue="Cairo, Egypt" />
          <Button>Save</Button>
        </TabsContent>

        <TabsContent value="smtp" className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6">
          <Row label="SMTP host" defaultValue="smtp.mailtrap.io" />
          <Row label="SMTP port" defaultValue="587" />
          <Row label="Username" defaultValue="admin" />
          <Row label="From email" defaultValue="no-reply@theknower.io" />
          <Button>Save</Button>
        </TabsContent>

        <TabsContent value="api" className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6">
          <Row label="API base URL" defaultValue="https://api.theknowersystem.com/api/v1" />
          <Row label="Version" defaultValue="v1" />
          <p className="text-xs text-muted-foreground">Rotate API tokens from your Laravel Sanctum dashboard.</p>
        </TabsContent>

        <TabsContent value="backup" className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between"><Label>Automatic daily backup</Label><Switch defaultChecked /></div>
          <Row label="S3 bucket" defaultValue="knower-backups" />
          <Row label="Retention (days)" defaultValue="30" />
          <Button>Backup now</Button>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6">
          {["Invoice paid", "Domain expiring", "Hosting expiring", "New ticket", "New bug"].map((n) => (
            <div key={n} className="flex items-center justify-between">
              <Label>{n}</Label>
              <Switch defaultChecked />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between"><Label>Two-factor authentication</Label><Switch /></div>
          <div className="flex items-center justify-between"><Label>Enforce strong passwords</Label><Switch defaultChecked /></div>
          <div className="flex items-center justify-between"><Label>Session timeout (30 min)</Label><Switch defaultChecked /></div>
        </TabsContent>

        <TabsContent value="roles" className="mt-6 space-y-4">
          {ALL_ROLES.map((r) => (
            <div key={r} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-semibold">{ROLE_LABELS[r]}</h4>
                <span className="text-xs text-muted-foreground">{ROLE_PERMISSIONS[r].length} permissions</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {ROLE_PERMISSIONS[r].slice(0, 12).map((p) => (
                  <StatusBadge key={p} value={p.replace(".", " ")} />
                ))}
                {ROLE_PERMISSIONS[r].length > 12 && (
                  <span className="text-xs text-muted-foreground">+{ROLE_PERMISSIONS[r].length - 12} more</span>
                )}
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Row({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[200px_1fr] sm:items-center">
      <Label>{label}</Label>
      <Input defaultValue={defaultValue} />
    </div>
  );
}
