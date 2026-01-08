import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardContent } from "./_components/dashboard-content";

import { requireUser } from "@/data/user/require-user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const dashboardUser = {
    name: user.name ?? null,
    email: user.email,
    image: user.image ?? null,
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={dashboardUser} />
      <SidebarInset>
        <SiteHeader user={dashboardUser} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <DashboardContent userId={user.id}>{children}</DashboardContent>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
