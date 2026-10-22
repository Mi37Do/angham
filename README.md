# Angham Al Andalous

Site de l’association (Next.js 16, fr / ar / en) avec administration intégrée.

## Démarrage

```bash
cp .env.example .env            # puis choisir un mot de passe Postgres
docker compose up -d            # base Postgres « angham.db » sur 127.0.0.1:5437
npm install
npm run db:migrate              # crée les tables
npm run db:seed                 # articles et bibliothèque de départ
npm run admin:create -- email@exemple.dz "Nom" "mot-de-passe-long"
npm run dev
```

- Site public : `/fr`, `/ar`, `/en`
- Administration : `/admin` (événements, publications, bibliothèque, messages de contact)

## Base de données

- Schéma : `db/schema.ts` (Drizzle ORM). Après modification : `npm run db:generate` puis `npm run db:migrate`.
- `npm run db:studio` pour explorer les données.
- `next build` lit la base (pages publiques pré-rendues) : Postgres doit être accessible pendant le build.

## Charte graphique

Fichiers sources dans `assets/` ; copies servies depuis `public/brand/` et `app/fonts/`.
Couleurs dans `app/globals.css` (vert `#1d3b1b`).
# angham

## Aperçu sans base de données (Vercel)

Le site peut tourner sans Postgres, en lecture seule, à partir d’un instantané du contenu
versionné dans le dépôt :

```bash
npm run content:export   # écrit content/snapshot.json (+ images téléversées dans public/snapshot/)
```

Sans `DATABASE_URL` (ou avec `CONTENT_SOURCE=snapshot`), le site lit cet instantané :
toutes les pages publiques fonctionnent, le formulaire de contact et l’administration
affichent un message « aperçu ». Sur Vercel, il suffit donc de ne définir aucune variable
d’environnement. Après chaque modification du contenu en local : `npm run content:export`,
puis commit et redéploiement.
