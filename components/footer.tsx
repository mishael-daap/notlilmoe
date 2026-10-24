import Link from "next/link";
import { artist } from "@/config/artist";

export async function Footer() {
  "use cache";

  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 px-5 pb-8 sm:px-8">
      <div className="flex flex-wrap gap-x-6 border-t border-rule pt-3">
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
      </div>

      <div className="mt-6 flex items-end justify-between gap-4">
        <Link
          href="/privacy"
          className="inline-flex min-h-11 items-center text-[11px] uppercase tracking-[0.2em] text-foreground/50 hover:text-foreground"
        >
          Privacy
        </Link>
        <span className="inline-flex min-h-11 items-center text-[11px] uppercase tracking-[0.2em] text-foreground/45">
          &copy; {year} {artist.name}
        </span>
      </div>
    </footer>
  );
}
