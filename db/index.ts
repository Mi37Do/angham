import "server-only";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

type Db = ReturnType<typeof createDb>;
const globalForDb = globalThis as unknown as { db?: Db };

function createDb() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  return drizzle(process.env.DATABASE_URL, { schema });
}

/**
 * Connected on first use, not at import: the snapshot preview (no DATABASE_URL)
 * imports modules that mention `db` without ever querying it.
 */
export const db = new Proxy({} as Db, {
  get(_target, property) {
    // Réutilise la connexion entre les rechargements à chaud en développement.
    globalForDb.db ??= createDb();
    return Reflect.get(globalForDb.db, property, globalForDb.db);
  },
});
