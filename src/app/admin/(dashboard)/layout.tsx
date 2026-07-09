import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="dark min-h-screen flex bg-bg text-ink scheme-dark">
      <AdminNav />
      <main className="flex-1 py-8 px-10 overflow-y-auto">{children}</main>
    </div>
  );
}
