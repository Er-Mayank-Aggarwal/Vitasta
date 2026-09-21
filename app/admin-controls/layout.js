import { getSession } from "@/lib/auth";
import AdminLayoutClient from "./AdminLayoutClient";
import AuthForm from "@/app/components/AuthForm";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  const session = await getSession();

  const isAdmin = session?.user && (session.user.role === "ADMIN" || session.user.role === "OWNER");

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#0B3B60]/10 border border-[#0B3B60]/20 flex items-center justify-center mx-auto text-[#0B3B60]">
              <ShieldAlert className="w-6 h-6 text-[#C1272D]" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#0B3B60]">
              Vitasta Atelier Admin Access
            </h1>
            <p className="text-xs text-neutral-500">
              Please sign in with your administrator credentials or use the Quick Test Atelier Admin access below.
            </p>
          </div>

          <AuthForm isModal={false} />

          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#0B3B60] hover:text-[#C1272D] font-semibold hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <AdminLayoutClient user={session.user}>{children}</AdminLayoutClient>;
}
