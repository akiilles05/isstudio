import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div style={{ minHeight: "100vh", background: "#07091c", display: "flex" }}>
      <AdminNav />
      <main
        style={{
          flex: 1,
          padding: "32px 40px",
          overflowY: "auto",
        }}
      >
        {children}
      </main>
    </div>
  );
}
