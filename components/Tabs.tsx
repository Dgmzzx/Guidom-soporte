"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/inventario", label: "Inventario" },
  { href: "/materiales", label: "Materiales" },
  { href: "/movimientos", label: "Movimientos" },
];

export default function Tabs() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-line bg-steel-deep/30 px-4 sm:px-8">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`relative shrink-0 px-3 py-3 font-mono text-[11px] uppercase tracking-widest transition-colors sm:px-4 ${
              active ? "text-paper" : "text-paper-dim hover:text-paper"
            }`}
          >
            {tab.label}
            {active && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-safety" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
