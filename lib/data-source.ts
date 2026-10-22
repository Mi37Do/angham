// Where the site's content comes from.
//   database — Postgres (DATABASE_URL): the full site, with the administration.
//   snapshot — content/snapshot.json committed in the repo: a read-only preview
//              (e.g. on Vercel) with no database. Export it with `npm run content:export`.
export const hasDatabase = Boolean(process.env.DATABASE_URL) && process.env.CONTENT_SOURCE !== "snapshot";
