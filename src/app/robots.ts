/**
 * robots.ts
 * ─────────────────────────────────────────────────────────────
 * Defines crawl rules for search engine bots.
 * Served at /robots.txt by Next.js App Router.
 *
 * Rules:
 *   - Allow all public marketing pages
 *   - Disallow /api/* (no indexing of API routes)
 *   - Sitemap location declared for crawlers
 */

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/"],
            },
        ],
        sitemap: "https://helixflow.cloud/sitemap.xml",
    };
}
