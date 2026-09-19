"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Dialog } from "radix-ui";
import { useState } from "react";
import { CommandMenu } from "@/components/command-menu";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { SidebarNav } from "@/components/layout/nav";
import type { ChromeProps } from "@/components/layout/sidebar";
import { Socials } from "@/components/layout/socials";
import { ThemeToggle } from "@/components/theme";

/** Top bar shown below the `lg` breakpoint; the menu slides in from the left as a drawer. */
export function MobileHeader({ lang, profile, menu }: ChromeProps) {
  const [open, setOpen] = useState(false);
  const home = menu.nav[0].href;

  return (
    <header className="no-print sticky top-0 z-40 -mx-5 border-b bg-background/85 px-5 backdrop-blur-md lg:hidden">
      <div className="flex h-14 items-center gap-2">
        <Link href={home} className="flex min-w-0 items-center gap-2.5">
          <Image
            src={profile.avatar}
            alt=""
            width={28}
            height={28}
            className="size-7 shrink-0 rounded-lg border object-cover object-[50%_30%]"
          />
          <span className="truncate text-[15px] font-semibold tracking-tight">{profile.name}</span>
        </Link>

        <div className="ml-auto flex items-center gap-1">
          <CommandMenu {...menu} variant="icon" />
          <LanguageSwitcher current={lang} label={menu.t.language} className="px-2" />
          <ThemeToggle label={menu.t.toggleTheme} bordered />

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger
              aria-label={menu.t.openMenu}
              className="flex size-8 items-center justify-center rounded-lg border bg-surface text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
            >
              <Menu className="size-4" />
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="sheet-overlay fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]" />
              <Dialog.Content
                aria-describedby={undefined}
                className="sheet-content fixed inset-y-0 left-0 z-50 flex w-[82%] max-w-xs flex-col border-r bg-background px-5 py-5 shadow-[16px_0_40px_-20px_rgb(0_0_0/0.3)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <Link href={home} onClick={() => setOpen(false)} className="flex min-w-0 items-center gap-3">
                    <Image
                      src={profile.avatar}
                      alt=""
                      width={40}
                      height={40}
                      className="size-10 shrink-0 rounded-xl border object-cover object-[50%_30%]"
                    />
                    <div className="min-w-0">
                      <Dialog.Title className="truncate text-[15px] font-semibold leading-tight tracking-tight">
                        {profile.name}
                      </Dialog.Title>
                      <p className="truncate text-xs text-muted-foreground">{profile.headline}</p>
                    </div>
                  </Link>
                  <Dialog.Close
                    aria-label={menu.t.closeMenu}
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-surface text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                  >
                    <X className="size-4" />
                  </Dialog.Close>
                </div>

                <div className="-mx-3 mt-8">
                  <SidebarNav id="mobile" items={menu.nav} onNavigate={() => setOpen(false)} />
                </div>

                <div className="mt-auto border-t pt-4">
                  <Socials socials={profile.socials} className="-ml-2" />
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
