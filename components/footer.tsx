import { artist } from "@/config/artist";

/**
 * Only real destinations are rendered: socials appear once `config/artist.ts`
 * has actual URLs, and the privacy link returns when that page exists.
 */
export async function Footer() {
  "use cache";

  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 px-5 pb-8 sm:px-8">
      <div className="flex flex-wrap items-center gap-x-6 border-t border-rule pt-3">
        {artist.socials.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center text-[11px] uppercase tracking-[0.2em] text-foreground/70 hover:text-foreground"
          >
            {label}
          </a>
        ))}

        <span className="ml-auto inline-flex min-h-11 items-center text-[11px] uppercase tracking-[0.2em] text-foreground/45">
          &copy; {year} {artist.name}
        </span>
      </div>
    </footer>
  );
}
