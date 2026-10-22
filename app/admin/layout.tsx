import type { Metadata } from "next";
import { fontVariables } from "../fonts";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "Administration", template: "%s — Administration Angham Al Andalous" },
  robots: { index: false, follow: false },
  icons: { icon: "/brand/small_logo.svg" },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="fr" className={`${fontVariables} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full">
        {children}
      </body>
    </html>
  );
}
