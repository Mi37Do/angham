import localFont from "next/font/local";

// Polices de la charte graphique (assets/fonts).
export const cairo = localFont({
  src: "./fonts/cairo.ttf",
  variable: "--font-cairo",
  weight: "200 1000",
  display: "swap",
});

export const openSans = localFont({
  src: "./fonts/opensans.ttf",
  variable: "--font-open-sans",
  weight: "300 800",
  display: "swap",
});

export const stolzl = localFont({
  src: [
    { path: "./fonts/stolzl_light.otf", weight: "300" },
    { path: "./fonts/stolzl_regular.otf", weight: "400" },
    { path: "./fonts/stolzl_medium.otf", weight: "500" },
    { path: "./fonts/stolzl_bold.otf", weight: "700" },
  ],
  variable: "--font-stolzl",
  display: "swap",
});

export const fontVariables = `${cairo.variable} ${openSans.variable} ${stolzl.variable}`;
