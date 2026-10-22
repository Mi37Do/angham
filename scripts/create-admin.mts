// Usage : npm run admin:create -- email@exemple.dz "Nom" motdepasse
import { drizzle } from "drizzle-orm/node-postgres";
import { users } from "../db/schema";
import { hashPassword } from "../lib/password";

const [email, name, password] = process.argv.slice(2);
if (!email || !name || !password || password.length < 10) {
  console.error('Usage: npm run admin:create -- <email> "<nom>" <mot de passe ≥ 10 caractères>');
  process.exit(1);
}

const db = drizzle(process.env.DATABASE_URL!);
await db
  .insert(users)
  .values({ email: email.toLowerCase(), name, passwordHash: await hashPassword(password) })
  .onConflictDoUpdate({
    target: users.email,
    set: { name, passwordHash: await hashPassword(password) },
  });
console.log(`Administrateur ${email} prêt.`);
process.exit(0);
