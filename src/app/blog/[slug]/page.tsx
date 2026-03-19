/**
 * /blog/[slug] — Individual blog post page
 * ─────────────────────────────────────────────────────────────
 * Statically generated for all known slugs.
 * Returns 404 for any slug not found in the data source.
 *
 * SEO:
 *   - generateMetadata per article (title, description, OG, Twitter)
 *   - generateStaticParams for all 6 slugs → static HTML at build time
 *
 * CMS migration path:
 *   Replace getArticleBySlug with a fetch() and update
 *   generateStaticParams to call your CMS API for all slugs.
 *   No other changes needed.
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug, getAllSlugs } from "@/lib/blog/articles";
import BlogPostLayout from "@/components/blog/BlogPostLayout";
import BlogNavbar from "@/components/blog/BlogNavbar";

// ── Static generation ─────────────────────────────────────────────────────────

export function generateStaticParams() {
    return getAllSlugs().map((slug) => ({ slug }));
}

// ── Per-page metadata ─────────────────────────────────────────────────────────

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const article = getArticleBySlug(slug);

    if (!article) {
        return {
            title: "Article not found — HelixFlow",
        };
    }

    const description = article.metaDescription ?? article.excerpt;
    const url = `https://helixflow.cloud/blog/${article.slug}`;

    return {
        title: `${article.title} — HelixFlow`,
        description,
        openGraph: {
            title: article.title,
            description,
            type: "article",
            url,
            siteName: "HelixFlow",
            publishedTime: article.publishedAt,
            tags: [article.tag],
        },
        twitter: {
            card: "summary_large_image",
            title: article.title,
            description,
        },
        alternates: {
            canonical: url,
        },
    };
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const article = getArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    return (
        <>
            <BlogNavbar showBack />
            <BlogPostLayout article={article} />
        </>
    );
}
