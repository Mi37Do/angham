import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Images uploaded from the administration. Kept outside public/ (which is fixed
// at build time) and served by app/uploads/[name]/route.ts.
export const uploadDir = path.resolve(process.env.UPLOAD_DIR ?? "uploads");

const accepted = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const maxBytes = 10 * 1024 * 1024;

export class UploadError extends Error {}

/** Resizes to at most 1600px wide, stores as WebP, returns its public path. */
export async function saveCover(file: File) {
  if (!accepted.has(file.type)) throw new UploadError("Format accepté : JPEG, PNG, WebP ou AVIF.");
  if (file.size > maxBytes) throw new UploadError("Image trop lourde (10 Mo maximum).");

  const webp = await sharp(Buffer.from(await file.arrayBuffer()))
    .rotate() // honour the camera's orientation
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer()
    .catch(() => {
      throw new UploadError("Ce fichier n’est pas une image lisible.");
    });

  await mkdir(uploadDir, { recursive: true });
  const name = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.webp`;
  await writeFile(path.join(uploadDir, name), webp);
  return `/uploads/${name}`;
}
