import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getDictionary, getLocale } from "./dictionaries";

/* foundoq.web's 404: the sentence is the one big thing, then the way onward. */
export default async function NotFound() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return (
    <div className="shell grid gap-10 pt-[clamp(40px,6vw,96px)] md:grid-cols-12 md:gap-x-[var(--gutter)]">
      <div className="flex flex-col items-start gap-8 md:col-span-6 md:pt-8">
        <h1 data-rise className="title-3xl max-w-[16ch]">
          {dict.common.notFound}
        </h1>
        <p data-rise style={{ "--i": 1 } as React.CSSProperties} className="max-w-[46ch] text-[1.125rem]">
          {dict.common.notFoundHint}
        </p>
        <Link
          href={`/${locale}`}
          data-rise
          style={{ "--i": 2 } as React.CSSProperties}
          className="btn btn-primary btn-xl"
        >
          {dict.common.goHome}
          <ArrowRight size={18} className="rtl:rotate-180" aria-hidden />
        </Link>
      </div>
      <div className="bg-field-inverse relative isolate flex aspect-[3/4] items-end justify-center overflow-hidden md:col-span-5 md:col-start-8">
        <div className="bg-mosaic absolute inset-0 -z-10 opacity-20 invert" aria-hidden />
        <Image src="/brand/rbab_angham.svg" alt="" width={300} height={359} className="h-[85%] w-auto" />
      </div>
    </div>
  );
}
