import Image from "next/image";
import Link from "next/link";

/** Shown instead of the administration when the site runs from the content snapshot. */
export function PreviewNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="card flex max-w-md flex-col items-center gap-4 p-8 text-center">
        <Image src="/brand/small_logo.svg" alt="" width={48} height={55} />
        <h1 className="pixa-title">Version de démonstration</h1>
        <p>
          Ce site est un aperçu en lecture seule, servi depuis un instantané du contenu. L’administration
          est disponible sur l’installation avec base de données.
        </p>
        <Link href="/fr" className="btn btn-primary">
          Voir le site
        </Link>
      </div>
    </div>
  );
}
