import { cookies } from "next/headers";
import ClientAppLayout from "@/components/layout/ClientAppLayout";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sidebarCookie = cookieStore.get("sidebar_state")?.value;
  // Default open unless explicitly saved as false
  const defaultSidebarOpen = sidebarCookie !== "false";

  return (
    <ClientAppLayout defaultSidebarOpen={defaultSidebarOpen}>
      {children}
    </ClientAppLayout>
  );
}
