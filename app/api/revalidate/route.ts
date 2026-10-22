import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { tags } from "@/lib/content";

// Lets scripts that write to the database directly (npm run db:seed) refresh
// the public pages. The admin does not need it: its actions call updateTag().
const known = new Set<string>(Object.values(tags));

function authorized(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const given = request.headers.get("x-revalidate-secret");
  if (!secret || !given || given.length !== secret.length) return false;
  return timingSafeEqual(Buffer.from(given), Buffer.from(secret));
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) return new Response("Unauthorized", { status: 401 });
  const { tags: requested } = (await request.json().catch(() => ({}))) as { tags?: string[] };
  const valid = (requested ?? []).filter((tag) => known.has(tag));
  // expire: 0 — the next visit renders fresh content instead of the stale copy.
  for (const tag of valid) revalidateTag(tag, { expire: 0 });
  return Response.json({ revalidated: valid });
}
