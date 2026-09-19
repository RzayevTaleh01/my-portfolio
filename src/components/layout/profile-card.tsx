import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Profile } from "@/content";

/** Photo, name and role - the identity block at the top of the sidebar. */
export function ProfileCard({ profile, homeHref }: { profile: Profile; homeHref: string }) {
  return (
    <div className="space-y-4">
      <Link href={homeHref} className="block w-fit" aria-label={profile.name}>
        <Image
          src={profile.avatar}
          alt={profile.name}
          width={80}
          height={80}
          priority
          className="size-20 rounded-2xl border object-cover object-[50%_30%]"
        />
      </Link>
      <div className="space-y-1">
        <p className="text-xl font-semibold tracking-tight">{profile.name}</p>
        <p className="text-sm text-muted-foreground">{profile.headline}</p>
      </div>
      <p className="flex items-center gap-1.5 text-[13px] text-subtle-foreground">
        <MapPin className="size-3.5" />
        {profile.now}
      </p>
    </div>
  );
}
