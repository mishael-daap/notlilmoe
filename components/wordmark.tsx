import { artist } from "@/config/artist";

export function Wordmark() {
  return (
    <span className="text-[13px] font-medium uppercase tracking-[0.28em]">
      {artist.name}
    </span>
  );
}
