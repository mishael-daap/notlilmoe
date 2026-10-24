/**
 * The two destinations the funnel sells. Slugs appear in `/go/<slug>` and in
 * the `subscribers.platform` column, so they are part of the data contract —
 * renaming one needs a SQL migration.
 */
import { artist } from "@/config/artist";

export const platforms = [
  {
    slug: "spotify",
    name: "Spotify",
    url: artist.spotifyUrl,
    /** Brand mark colour. */
    color: "#1DB954",
  },
  {
    slug: "apple-music",
    name: "Apple Music",
    url: artist.appleMusicUrl,
    /** Official mark is a gradient; flattened to fit the no-gradient rule. */
    color: "#FA243C",
  },
] as const;

export type PlatformSlug = (typeof platforms)[number]["slug"];

export function findPlatform(slug: string) {
  return platforms.find((platform) => platform.slug === slug);
}
