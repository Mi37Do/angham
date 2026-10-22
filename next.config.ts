import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `next dev` only: hosts the site is opened from besides localhost (LAN, Tailscale).
  // Without them the browser's JS is blocked and nothing interactive works.
  allowedDevOrigins: ["192.168.100.13", "100.126.119.31"],
  experimental: {
    agentFeedback: true,
    // Cover images are uploaded through admin Server Actions (resized server-side).
    serverActions: { bodySizeLimit: "10mb" },
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
