import { NextResponse, type NextRequest } from "next/server";
import { findPlatform } from "@/lib/platforms";
import { readFanId } from "@/lib/fan-cookie";
import { recordPlatform } from "@/lib/subscribers";

/**
 * Records the fan's choice, then hands them to the profile. Recording is best
 * effort: a failed write must never stand between a fan and the music.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ platform: string }> },
) {
  const { platform } = await context.params;
  const match = findPlatform(platform);

  if (!match) {
    return NextResponse.redirect(new URL("/", request.nextUrl.origin));
  }

  const fanId = await readFanId();

  if (fanId) {
    try {
      await recordPlatform(fanId, match.slug);
    } catch (error) {
      console.error("[go] could not record platform", error);
    }
  }

  return NextResponse.redirect(match.url, 302);
}
