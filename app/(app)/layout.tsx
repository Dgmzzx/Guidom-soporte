import type { ReactNode } from "react";
import Header from "@/components/Header";
import Tabs from "@/components/Tabs";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen">
      <Header />
      <Tabs />
      <div className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8">{children}</div>
    </main>
  );
}
