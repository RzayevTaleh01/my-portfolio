"use client";

import {
  Award,
  BookOpen,
  ChartColumn,
  Briefcase,
  Database,
  ExternalLink,
  FileText,
  FlaskConical,
  FolderKanban,
  GraduationCap,
  Hand,
  HandHeart,
  Image as ImageIcon,
  Languages,
  LayoutDashboard,
  LogOut,
  MapPin,
  Newspaper,
  Sparkles,
  Type,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const groups: { title: string; items: NavItem[] }[] = [
  {
    title: "",
    items: [
      { href: "/admin", label: "Overview", icon: LayoutDashboard },
      { href: "/admin/cv", label: "CV builder", icon: FileText },
      { href: "/admin/analytics", label: "Analytics", icon: ChartColumn },
      { href: "/admin/claps", label: "Claps", icon: Hand },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/content/profile", label: "Profile", icon: UserRound },
      { href: "/admin/content/regions", label: "Locations", icon: MapPin },
      { href: "/admin/content/experience", label: "Experience", icon: Briefcase },
      { href: "/admin/content/volunteering", label: "Volunteering", icon: HandHeart },
      { href: "/admin/content/education", label: "Education", icon: GraduationCap },
      { href: "/admin/content/certificates", label: "Certificates", icon: Award },
      { href: "/admin/content/languages", label: "Languages", icon: Languages },
      { href: "/admin/content/skills", label: "Skills", icon: Sparkles },
      { href: "/admin/content/research", label: "Research", icon: FlaskConical },
      { href: "/admin/content/projects", label: "Projects", icon: FolderKanban },
      { href: "/admin/content/publications", label: "Publications", icon: BookOpen },
      { href: "/admin/content/posts", label: "Articles", icon: Newspaper },
      { href: "/admin/texts", label: "Site texts", icon: Type },
    ],
  },
  {
    title: "Files",
    items: [
      { href: "/admin/media", label: "Photos", icon: ImageIcon },
      { href: "/admin/backup", label: "Backup", icon: Database },
    ],
  },
];

declare global {
  interface Window {
    __adminDirty?: boolean;
  }
}

export function setAdminDirty(dirty: boolean) {
  if (typeof window !== "undefined") window.__adminDirty = dirty;
}

function leaveOk() {
  return !window.__adminDirty || confirm("You have unsaved changes. Leave this page anyway?");
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    if (!leaveOk()) return;
    await fetch("/api/admin/session", { method: "DELETE" });
    router.refresh();
  }

  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[232px_minmax(0,1fr)]">
      <aside className="border-b bg-surface lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-4 py-3 lg:py-4">
          <p className="text-sm font-semibold tracking-tight">Admin</p>
          <div className="flex items-center gap-1 lg:hidden">
            <Link href="/" target="_blank" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="View site">
              <ExternalLink className="size-4" />
            </Link>
            <button onClick={logout} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Log out">
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:gap-4 lg:overflow-y-auto lg:pb-4">
          {groups.map((group) => (
            <div key={group.title || "main"} className="flex gap-1 lg:flex-col lg:gap-0.5">
              {group.title && (
                <p className="hidden px-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-subtle-foreground lg:block">{group.title}</p>
              )}
              {group.items.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={(e) => {
                    if (!leaveOk()) e.preventDefault();
                    else setAdminDirty(false);
                  }}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] transition-colors",
                    active(href) ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0" strokeWidth={1.8} />
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="hidden space-y-0.5 border-t px-3 py-3 lg:block">
          <Link href="/" target="_blank" className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] text-muted-foreground hover:bg-muted/60 hover:text-foreground">
            <ExternalLink className="size-4" strokeWidth={1.8} /> View site
          </Link>
          <button onClick={logout} className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] text-muted-foreground hover:bg-muted/60 hover:text-foreground">
            <LogOut className="size-4" strokeWidth={1.8} /> Log out
          </button>
        </div>
      </aside>
      <main className="min-w-0">{children}</main>
    </div>
  );
}
