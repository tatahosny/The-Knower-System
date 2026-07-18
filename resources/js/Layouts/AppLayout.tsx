import { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { usePage } from "@inertiajs/react";
import { PageTransition } from "@/components/animations/PageTransition";

interface Props {
  children: ReactNode;
}

export default function AppLayout({ children }: Props) {
  const { url } = usePage();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="min-w-0 flex-1">
          <AppHeader />
          <main className="mx-auto w-full max-w-[1600px] p-6 overflow-x-hidden">
            <PageTransition key={url}>
              {children}
            </PageTransition>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
