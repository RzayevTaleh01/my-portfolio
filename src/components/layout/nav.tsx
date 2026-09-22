"use client";

import { LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
}

export function SidebarNav({ id, items, onNavigate }: { id: string; items: NavItem[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  const home = items[0]?.href;

  const isActive = (href: string) =>
    href === home ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <LayoutGroup id={id}>
      <nav aria-label="Main">
        <ul className="space-y-0.5">
          {items.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative block rounded-lg px-3 py-2 text-sm transition-colors",
                    active ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-lg bg-muted"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </LayoutGroup>
  );
}
