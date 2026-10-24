import type { Metadata } from "next";
import { platforms } from "@/lib/platforms";
import { PlatformItem } from "@/components/platform-item";
import { Wordmark } from "@/components/wordmark";

export const metadata: Metadata = {
  title: "Listen",
};

/**
 * Public on purpose. The form is what captures a fan; this page only has to
 * get them to the right service, so it never blocks anyone.
 */
export default function ListenPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="px-5 pt-5 sm:px-8">
        <Wordmark />
      </header>

      <main className="flex flex-1 flex-col justify-center px-5 sm:px-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/55">
          Where do you listen?
        </p>

        <div className="mt-4 border-t border-rule">
          {platforms.map(({ slug, name, color }) => (
            <PlatformItem key={slug} slug={slug} name={name} color={color} />
          ))}
        </div>
      </main>
    </div>
  );
}
