/**
 * Single source of truth for everything visible on the site.
 * Edit release copy and links here — components never hardcode content.
 */

export type Social = { label: string; href: string };

export const artist = {
  name: "notlilmoe",

  /** Big statement line. Keep it short — it is set near full-bleed. */
  tagline: "NEW MUSIC OUT NOW",

  /** Small line under the tagline. Leave empty for none. */
  subline: "Stream the new single and get told first.",

  /**
   * Per-release accent. Swap this one value to re-skin the page.
   * Light theme: pick something dark enough to read on `background`
   * (the old #d8ff3e lime sits at 1.03:1 on paper and disappears).
   */
  accent: "#5a6b00",

  /** Light theme: warm paper, near-black type. */
  background: "#f4f2ee",
  foreground: "#101010",

  /** /images/... inside /public, or null for the placeholder. */
  image: "/images/portrait.jpg" as string | null,

  /** Full-bleed landscape strip beside the portrait; null hides it. */
  imageWide: "/images/wide.jpg" as string | null,

  spotifyUrl: "https://open.spotify.com/artist/7KEeOhkWNRV8cNMAkbZJ5q",
  appleMusicUrl: "https://music.apple.com/ng/artist/notlilmoe/1533854366",

  /** Empty until the real accounts exist — the footer hides the row when so. */
  socials: [] as Social[],

  /** Small label opposite the wordmark. */
  status: "OFFICIAL SITE",
} as const;
