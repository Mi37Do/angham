// Usage : npm run content:export
// Writes the published content to content/snapshot.json (committed in the repo)
// so the site can run without a database, e.g. as a preview on Vercel.
// Images uploaded from the administration are copied to public/snapshot/.
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { events, publications, resources } from "../db/schema";

const db = drizzle(process.env.DATABASE_URL!);
const uploadDir = path.resolve(process.env.UPLOAD_DIR ?? "uploads");
const snapshotImages = path.resolve("public/snapshot");

/** /uploads/x.webp lives outside public/: copy it next to the snapshot. */
async function portable(image: string | null) {
  if (!image?.startsWith("/uploads/")) return image;
  const name = path.basename(image);
  await mkdir(snapshotImages, { recursive: true });
  await copyFile(path.join(uploadDir, name), path.join(snapshotImages, name));
  return `/snapshot/${name}`;
}

const [eventRows, publicationRows, resourceRows] = await Promise.all([
  db.select().from(events).where(eq(events.published, true)),
  db.select().from(publications).where(eq(publications.published, true)),
  db.select().from(resources).where(eq(resources.published, true)),
]);

const snapshot = {
  exportedAt: new Date().toISOString(),
  events: await Promise.all(eventRows.map(async (e) => ({ ...e, coverImage: await portable(e.coverImage) }))),
  publications: await Promise.all(
    publicationRows.map(async (p) => ({ ...p, coverImage: await portable(p.coverImage) })),
  ),
  resources: resourceRows,
};

await writeFile("content/snapshot.json", JSON.stringify(snapshot, null, 2) + "\n");
console.log(
  `content/snapshot.json : ${snapshot.publications.length} publications, ${snapshot.events.length} événements, ${snapshot.resources.length} ressources.`,
);
process.exit(0);
