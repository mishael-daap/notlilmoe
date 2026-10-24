import Image from "next/image";
import { artist } from "@/config/artist";

/**
 * Banner with a profile portrait overlapping its lower edge. The portrait wears
 * a border in the page colour so it reads as cut out of the photo, not pasted
 * on it. Everything else is the same hairline, no-shadow language as the rest.
 */
export function HeroMedia() {
  const banner = artist.imageWide;
  const portrait = artist.image;

  if (!banner && !portrait) {
    return (
      <section aria-label={`${artist.name} image`} className="w-full">
        <div className="relative aspect-3/2 w-full bg-foreground/6">
          <span className="absolute bottom-5 left-5 text-[11px] uppercase tracking-[0.3em] text-foreground/45">
            Artist image
          </span>
        </div>
      </section>
    );
  }

  return (
    <section aria-label={`${artist.name} images`} className="w-full">
      {banner ? (
        <div className="relative aspect-3/2 w-full overflow-hidden bg-foreground/6 sm:aspect-16/7">
          <Image
            src={banner}
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      {portrait ? (
        <div className="relative z-10 -mt-16 flex px-5 sm:-mt-24 sm:px-8">
          <div className="relative aspect-2/3 w-36 shrink-0 overflow-hidden border-[3px] border-background bg-foreground/6 sm:w-44">
            <Image
              src={portrait}
              alt={artist.name}
              fill
              priority
              sizes="(min-width: 640px) 176px, 144px"
              className="object-cover object-top"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
