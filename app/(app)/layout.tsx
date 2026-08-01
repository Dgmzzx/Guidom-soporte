import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Tabs from "@/components/Tabs";
import LogoutButton from "@/components/LogoutButton";
import { ToastProvider } from "@/components/Toast";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen">
      <Header actions={<LogoutButton />} />
      <Tabs />
      <ToastProvider>
        <div className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8">{children}</div>
      </ToastProvider>
    </main>
  );
}
