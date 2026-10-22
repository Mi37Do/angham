import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Reveals } from "@/components/reveals";
import { isRtl, locales } from "@/lib/i18n";
import { fontVariables } from "../fonts";
import { getDictionary, getLocale } from "./dictionaries";
import "../globals.css";

// Marks <html> for the motion styles in globals.css (foundoq.web's head script).
const jsMark = "document.documentElement.classList.add('js')";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: { default: dict.site.name, template: `%s — ${dict.site.name}` },
    description: dict.site.description,
    icons: { icon: "/brand/small_logo.svg" },
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();
  return (
    <html
      suppressHydrationWarning
      lang={locale}
      dir={isRtl(locale) ? "rtl" : "ltr"}
      className={fontVariables}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsMark }} />
      </head>
      {/* Browser extensions (Grammarly…) add attributes to <body> before React loads. */}
      <body suppressHydrationWarning className="bg-surface-app text-content-body flex min-h-dvh flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Reveals />
      </body>
    </html>
  );
}
