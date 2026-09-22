import type { SkillGroup } from "@/content";

export function SkillList({ groups }: { groups: SkillGroup[] }) {
  return (
    <dl className="space-y-4">
      {groups.map((g) => (
        <div key={g.title} className="grid gap-2 break-inside-avoid sm:grid-cols-[150px_1fr] sm:gap-6">
          <dt className="pt-1 text-sm font-medium">{g.title}</dt>
          <dd className="flex flex-wrap gap-1.5">
            {g.skills.map((s) => (
              <span key={s} className="rounded-md bg-muted px-2 py-1 text-[13px] leading-none text-muted-foreground">
                {s}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
