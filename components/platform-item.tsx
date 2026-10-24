import { PlatformLogo } from "@/components/platform-logo";
import type { PlatformSlug } from "@/lib/platforms";

/**
 * One destination, sized to be the main thing on the screen rather than a link
 * at the bottom. The href points at our own redirect so the choice is recorded
 * before the fan leaves.
 */
export function PlatformItem({
  slug,
  name,
  color,
}: {
  slug: PlatformSlug;
  name: string;
  color: string;
}) {
  return (
    <a
      href={`/go/${slug}`}
      rel="noopener noreferrer"
      className="group flex min-h-24 items-center gap-4 border-b border-rule py-6 uppercase leading-none tracking-tight hover:text-accent"
    >
      <PlatformLogo slug={slug} color={color} className="size-8 shrink-0 sm:size-10" />
      <span className="flex-1 text-[clamp(1.5rem,8vw,3rem)]">{name}</span>
      <span className="shrink-0 text-[clamp(1.1rem,4vw,1.5rem)] opacity-50 group-hover:opacity-100">
        &rarr;
      </span>
    </a>
  );
}
