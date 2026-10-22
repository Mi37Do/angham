import type { Metadata } from "next";
import Image from "next/image";
import { hasDatabase } from "@/lib/data-source";
import { PreviewNotice } from "../_components/preview-notice";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage() {
  if (!hasDatabase) return <PreviewNotice />;
  return (
    <div className="relative isolate flex min-h-screen items-center justify-center bg-[var(--green-800)] p-4">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[url('/brand/bg_mosaic.svg')] bg-[length:22rem_auto] opacity-15 invert"
      />
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Image src="/brand/aaa_logo_white.svg" alt="Angham Al Andalous" width={110} height={144} className="mx-auto" priority />
        <LoginForm />
      </div>
    </div>
  );
}
