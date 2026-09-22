import { MapPin } from "lucide-react";
import Link from "next/link";
import { AvatarZoom, type AvatarZoomLabels } from "@/components/layout/avatar-zoom";
import type { Profile } from "@/content";

export function ProfileCard({
  profile,
  homeHref,
  t,
}: {
  profile: Profile;
  homeHref: string;
  t: AvatarZoomLabels;
}) {
  return (
    <div className="space-y-4">
      <AvatarZoom
        src={profile.avatar}
        name={profile.name}
        t={t}
        priority
        sizes="128px"
        className="aspect-square w-32"
      />
      <div className="space-y-1">
        <Link href={homeHref} className="block w-fit text-xl font-semibold tracking-tight">
          {profile.name}
        </Link>
        <p className="text-sm text-muted-foreground">{profile.headline}</p>
      </div>
      <p className="flex items-center gap-1.5 text-[13px] text-subtle-foreground">
        <MapPin className="size-3.5" />
        {profile.now}
      </p>
    </div>
  );
}
