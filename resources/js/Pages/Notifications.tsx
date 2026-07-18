import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { useCollection, update, remove } from "@/mocks/store";
import { Button } from "@/components/ui/button";
import { Check, Trash2 } from "lucide-react";
import { shortDate } from "@/lib/format";

export default function NotificationsPage() {
  const { t } = useTranslation();
  const rows = useCollection("notifications");

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("common.notifications")}
        description="All recent activity across your workspace"
        actions={
          <Button variant="outline" onClick={() => rows.forEach((n) => update("notifications", n.id, { read: true }))}>
            <Check className="me-1 h-4 w-4" />
            Mark all read
          </Button>
        }
      />
      <div className="rounded-xl border border-border bg-card">
        {rows.length === 0 && <p className="p-10 text-center text-sm text-muted-foreground">Nothing here yet</p>}
        {rows.map((n) => (
          <div key={n.id} className={"flex items-start justify-between gap-4 border-b border-border/60 p-4 last:border-none " + (n.read ? "opacity-60" : "")}>
            <div className="flex items-start gap-3">
              <StatusBadge value={n.type} />
              <div>
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.message}</p>
                <p className="mt-1 text-[10px] uppercase text-muted-foreground">{shortDate(n.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!n.read && (
                <Button size="sm" variant="ghost" onClick={() => update("notifications", n.id, { read: true })}>
                  <Check className="h-4 w-4" />
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => remove("notifications", n.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
