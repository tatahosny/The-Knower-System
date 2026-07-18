import { router } from "@inertiajs/react";
import { Bell, Languages, LogOut, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/store/auth";
import { useLocaleStore } from "@/store/i18n";
import { useCollection } from "@/mocks/store";
import { ROLE_LABELS } from "@/lib/permissions";

export function AppHeader() {
  const { t, i18n } = useTranslation();
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const notifications = useCollection("notifications");
  const unread = notifications.filter((n) => !n.read).length;

  const switchLocale = () => {
    const next = locale === "en" ? "ar" : "en";
    setLocale(next);
    void i18n.changeLanguage(next);
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
  };

  const initials = user?.name?.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase() ?? "?";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger />
      <div className="flex-1" />
      <Button variant="ghost" size="sm" onClick={switchLocale} className="gap-1">
        <Languages className="h-4 w-4" />
        <span className="text-xs uppercase">{locale}</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => router.visit("/notifications")}
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute end-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
            {unread}
          </span>
        )}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 px-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {initials}
            </div>
            <div className="hidden text-start leading-tight md:block">
              <div className="text-xs font-semibold">{user?.name}</div>
              <div className="text-[10px] text-muted-foreground">
                {user ? ROLE_LABELS[user.role] : ""}
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.visit("/profile")}>
            <User className="me-2 h-4 w-4" />
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              logout();
              router.visit("/login");
            }}
          >
            <LogOut className="me-2 h-4 w-4" />
            {t("auth.signOut")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
