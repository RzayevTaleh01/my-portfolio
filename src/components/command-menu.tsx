"use client";

import { Command } from "cmdk";
import { ArrowUpRight, FileText, FolderKanban, Moon, PenLine, Search, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SocialIcon } from "@/components/icons";
import { startRouteProgress } from "@/components/top-loader";
import type { NavItem } from "@/components/layout/nav";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { SocialLink } from "@/content";
import type { Dictionary } from "@/i18n/dictionaries";

export interface CommandEntry {
  group: "projects" | "articles";
  title: string;
  href: string;
}

export interface CommandMenuProps {
  entries: CommandEntry[];
  nav: NavItem[];
  socials: SocialLink[];
  t: Dictionary["common"];
  groupLabels: Record<CommandEntry["group"], string>;
}

const itemClass =
  "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-foreground transition-colors data-[selected=true]:bg-muted";
const groupClass =
  "px-1.5 py-1 [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-subtle-foreground";

export function CommandMenu({ entries, nav, socials, t, groupLabels, variant }: CommandMenuProps & { variant: "full" | "icon" }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const run = (fn: () => void) => {
    setOpen(false);
    fn();
  };
  const go = (href: string) =>
    run(() => {
      startRouteProgress();
      router.push(href);
    });

  const groups = (["projects", "articles"] as const).map((g) => ({ name: g, items: entries.filter((e) => e.group === g) }));

  return (
    <>
      {variant === "full" ? (
        <button
          onClick={() => setOpen(true)}
          className="flex h-9 w-full items-center gap-2 rounded-lg border bg-surface px-3 text-[13px] text-subtle-foreground transition-colors hover:border-border-strong hover:text-muted-foreground"
        >
          <Search className="size-3.5" />
          <span>{t.search}</span>
          <kbd className="ml-auto rounded border bg-muted px-1.5 font-mono text-[10px]">Ctrl K</kbd>
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          aria-label={t.search}
          className="flex size-8 items-center justify-center rounded-lg hover:bg-muted"
        >
          <Search className="size-4" />
        </button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogTitle className="sr-only">{t.search}</DialogTitle>
          <Command loop>
            <div className="flex items-center gap-2 border-b px-4">
              <Search className="size-4 text-subtle-foreground" />
              <Command.Input
                autoFocus
                placeholder={t.searchPlaceholder}
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-subtle-foreground"
              />
            </div>
            <Command.List className="max-h-[60vh] overflow-y-auto py-1.5">
              <Command.Empty className="py-10 text-center text-sm text-muted-foreground">{t.noResults}</Command.Empty>

              <Command.Group heading={t.pages} className={groupClass}>
                {nav.map((item) => (
                  <Command.Item key={item.href} className={itemClass} onSelect={() => go(item.href)}>
                    <FileText className="size-4 text-subtle-foreground" /> {item.label}
                  </Command.Item>
                ))}
              </Command.Group>

              {groups.map(
                (g) =>
                  g.items.length > 0 && (
                    <Command.Group key={g.name} heading={groupLabels[g.name]} className={groupClass}>
                      {g.items.map((e) => (
                        <Command.Item
                          key={e.href}
                          value={`${g.name} ${e.title}`}
                          className={itemClass}
                          onSelect={() => go(e.href)}
                        >
                          {g.name === "projects" ? (
                            <FolderKanban className="size-4 text-subtle-foreground" />
                          ) : (
                            <PenLine className="size-4 text-subtle-foreground" />
                          )}
                          {e.title}
                        </Command.Item>
                      ))}
                    </Command.Group>
                  ),
              )}

              <Command.Group heading={t.links} className={groupClass}>
                {socials.map((s) => (
                  <Command.Item
                    key={s.href}
                    className={itemClass}
                    onSelect={() => run(() => window.open(s.href, "_blank", "noopener,noreferrer"))}
                  >
                    <SocialIcon platform={s.platform} className="text-subtle-foreground" /> {s.label}
                    <ArrowUpRight className="ml-auto size-3.5 text-subtle-foreground" />
                  </Command.Item>
                ))}
              </Command.Group>

              <Command.Group heading={t.theme} className={groupClass}>
                <Command.Item className={itemClass} onSelect={() => run(() => setTheme("light"))}>
                  <Sun className="size-4 text-subtle-foreground" /> {t.light}
                </Command.Item>
                <Command.Item className={itemClass} onSelect={() => run(() => setTheme("dark"))}>
                  <Moon className="size-4 text-subtle-foreground" /> {t.dark}
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
