import type { Profile } from "@/content";

export function SiteFooter({ profile }: { profile: Profile }) {
  return (
    <footer className="no-print mt-24 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t pt-6 text-[13px] text-subtle-foreground">
      <p>
        © {new Date().getFullYear()} {profile.name}
      </p>
      <p>{profile.location}</p>
    </footer>
  );
}
