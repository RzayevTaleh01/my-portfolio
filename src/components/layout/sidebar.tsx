import { CommandMenu, type CommandMenuProps } from "@/components/command-menu";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { SidebarNav } from "@/components/layout/nav";
import { ProfileCard } from "@/components/layout/profile-card";
import { Socials } from "@/components/layout/socials";
import { ThemeToggle } from "@/components/theme";
import type { Profile } from "@/content";
import type { Locale } from "@/i18n/config";

export interface ChromeProps {
  lang: Locale;
  profile: Profile;
  menu: CommandMenuProps;
}

/** Language and theme controls pinned to the top-right corner on desktop (the mobile header has its own). */
export function DesktopControls({ lang, menu }: Pick<ChromeProps, "lang" | "menu">) {
  return (
    <div className="no-print fixed right-6 top-5 z-40 hidden items-center gap-2 lg:flex">
      <LanguageSwitcher current={lang} label={menu.t.language} />
      <ThemeToggle label={menu.t.toggleTheme} bordered />
    </div>
  );
}

/** Desktop sidebar: identity, navigation and links stay in view while content scrolls. */
export function Sidebar({ profile, menu }: ChromeProps) {
  return (
    <aside className="no-print sticky top-0 hidden h-dvh flex-col py-14 lg:flex">
      <ProfileCard profile={profile} homeHref={menu.nav[0].href} t={menu.t} />
      {/* Search and navigation share the same -mx-3 width, so their edges line up. */}
      <div className="-mx-3 mt-10 space-y-3">
        <CommandMenu {...menu} variant="full" />
        <SidebarNav id="sidebar" items={menu.nav} />
      </div>
      <div className="mt-auto border-t pt-5">
        <Socials socials={profile.socials} className="-ml-2" />
      </div>
    </aside>
  );
}
