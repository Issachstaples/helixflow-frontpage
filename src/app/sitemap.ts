/**
 * sitemap.ts
 * ─────────────────────────────────────────────────────────────
 * Generates the XML sitemap for HelixFlow.
 * Served at /sitemap.xml by Next.js App Router.
 *
 * Current routes:
 *   /   — Marketing homepage
 *
 * Future routes (add when live):
 *   /blog/[slug]     — if /blog route is added
 *   /updates/[slug]  — if Prismic editorial route is added
 */

import type { MetadataRoute } from "next";

const BASE_URL = "https://helixflow.cloud";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
    ];
}
