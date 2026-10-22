// Usage : npm run db:seed
// Insère ou met à jour le contenu de départ (db/seed) puis rafraîchit le site.
// Relançable : les articles sont repérés par leur slug, les ressources par leur URL.
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { publications, resources as resourcesTable } from "../db/schema";
import { articles } from "../db/seed/articles";
import { creditLine, media } from "../lib/media";
import { resources } from "../db/seed/resources";

const db = drizzle(process.env.DATABASE_URL!);

console.log("Articles");
for (const article of articles) {
  const values = {
    slug: article.slug,
    title: article.title,
    summary: article.summary,
    body: article.body,
    category: "article" as const,
    author: "Rédaction Angham Al Andalous",
    coverImage: media(article.image).file,
    coverCredit: creditLine(article.image),
    publishedAt: new Date(article.publishedAt),
    published: true,
  };
  await db
    .insert(publications)
    .values(values)
    .onConflictDoUpdate({ target: publications.slug, set: { ...values, updatedAt: sql`now()` } });
  console.log(`  ✓ ${article.title.fr}`);
}

console.log("Bibliothèque");
for (const resource of resources) {
  const values = {
    url: resource.url,
    type: resource.type,
    // Titre bibliographique : le même dans toutes les langues.
    title: { fr: resource.title },
    description: resource.description,
    author: resource.author,
    year: resource.year,
    rights: resource.rights,
    published: true,
  };
  const [existing] = await db
    .select({ id: resourcesTable.id })
    .from(resourcesTable)
    .where(eq(resourcesTable.url, resource.url))
    .limit(1);
  if (existing) await db.update(resourcesTable).set(values).where(eq(resourcesTable.id, existing.id));
  else await db.insert(resourcesTable).values(values);
  console.log(`  ✓ ${resource.title}`);
}

// Le seed écrit directement en base : on demande au site de vider ses caches.
const secret = process.env.REVALIDATE_SECRET;
const sites = (process.env.SITE_URLS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
for (const site of sites) {
  try {
    const res = await fetch(`${site}/api/revalidate`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-revalidate-secret": secret ?? "" },
      body: JSON.stringify({ tags: ["publications", "resources"] }),
    });
    console.log(res.ok ? `Site rafraîchi : ${site}` : `⚠ ${site} a répondu ${res.status}`);
  } catch {
    console.log(`⚠ ${site} injoignable (le site se mettra à jour au prochain démarrage ou d’ici une heure).`);
  }
}

process.exit(0);
