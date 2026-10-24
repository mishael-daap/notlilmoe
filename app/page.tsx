import { artist } from "@/config/artist";
import { Wordmark } from "@/components/wordmark";
import { SubscribeForm, type EmailJsConfig } from "@/components/subscribe-form";
import { HeroMedia } from "@/components/hero-media";
import { Footer } from "@/components/footer";

function emailJsConfig(): EmailJsConfig | null {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) return null;

  return {
    serviceId,
    templateId,
    publicKey,
    toEmail: process.env.NOTIFY_EMAIL ?? "msowunmi@gmail.com",
  };
}

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-5 pt-5 sm:px-8">
        <Wordmark />
        <span className="text-[11px] uppercase tracking-[0.3em] text-foreground/50">
          {artist.status}
        </span>
      </header>

      <HeroMedia />

      <main className="flex-1">
        <h1 className="mt-14 px-5 text-[clamp(2.75rem,13vw,7.5rem)] font-medium uppercase leading-[0.88] tracking-[-0.045em] text-balance sm:px-8">
          {artist.tagline}
        </h1>

        {artist.subline ? (
          <p className="mt-5 max-w-sm px-5 text-[13px] leading-relaxed text-foreground/60 sm:px-8">
            {artist.subline}
          </p>
        ) : null}

        <SubscribeForm emailjs={emailJsConfig()} />
      </main>

      <Footer />
    </div>
  );
}
