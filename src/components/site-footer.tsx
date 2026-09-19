import type { Profile } from "@/content";

export function SiteFooter({ profile }: { profile: Profile }) {
  return (
    <footer className="no-print mt-24 flex flex-col gap-2 border-t pt-6 text-[13px] text-subtle-foreground sm:flex-row sm:justify-between">
      <p>
        © {new Date().getFullYear()} {profile.name}
      </p>
      <p>{profile.location}</p>
    </footer>
  );
}
