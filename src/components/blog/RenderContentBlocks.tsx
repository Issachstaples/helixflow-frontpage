/**
 * RenderContentBlocks
 * ─────────────────────────────────────────────────────────────
 * Renders an array of ContentBlock objects as React elements.
 * Each block type maps to a private sub-component that handles
 * its own layout and typography.
 *
 * Usage:
 *   import RenderContentBlocks from "@/components/blog/RenderContentBlocks";
 *   <RenderContentBlocks blocks={article.body} />
 *
 * Or use the lower-level export directly:
 *   import { renderBlock } from "@/components/blog/RenderContentBlocks";
 *   {article.body.map((block, i) => renderBlock(block, i))}
 */

import type { ContentBlock } from "@/lib/blog/articles";
import { cn } from "@/lib/utils";

// ── Sub-components ─────────────────────────────────────────────────────────────

function BlockHeading({ text }: { text: string }) {
    return (
        <h2 className="mb-4 mt-10 text-xl font-semibold leading-snug tracking-tight text-[#F7FBFF] first:mt-0 sm:text-2xl">
            {text}
        </h2>
    );
}

function BlockParagraph({ text }: { text: string }) {
    return (
        <p className="mb-5 text-base leading-relaxed text-hx-slate last:mb-0 sm:text-[17px]">
            {text}
        </p>
    );
}

function BlockList({ items }: { items: string[] }) {
    return (
        <ul className="mb-5 space-y-2.5 pl-0">
            {items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                    <span
                        className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#2DBBEE]"
                        aria-hidden="true"
                    />
                    <span className="text-base leading-relaxed text-hx-slate sm:text-[17px]">
                        {item}
                    </span>
                </li>
            ))}
        </ul>
    );
}

function BlockCallout({ text, title }: { text: string; title?: string }) {
    return (
        <div
            className={cn(
                "my-8 rounded-xl px-5 py-5",
                "border border-[#2DBBEE]/20 border-l-[3px] border-l-[#2DBBEE]/70",
                "bg-[#2DBBEE]/[0.06]"
            )}
        >
            {title && (
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#2DBBEE]/80">
                    {title}
                </p>
            )}
            <p className="text-base leading-relaxed text-hx-chrome sm:text-[17px]">{text}</p>
        </div>
    );
}

function BlockQuote({ text, attribution }: { text: string; attribution?: string }) {
    return (
        <blockquote
            className={cn(
                "my-8 rounded-xl px-6 py-5",
                "border border-white/[0.07]",
                "bg-[rgba(15,33,69,0.40)] backdrop-blur-xl"
            )}
        >
            <p className="text-lg italic leading-relaxed text-hx-chrome sm:text-xl">
                &ldquo;{text}&rdquo;
            </p>
            {attribution && (
                <footer className="mt-3 text-sm text-hx-dim not-italic">— {attribution}</footer>
            )}
        </blockquote>
    );
}

// ── Renderer ──────────────────────────────────────────────────────────────────

/**
 * Renders a single ContentBlock. The switch is exhaustive against the
 * discriminated union — TypeScript will error if a variant is missing.
 */
export function renderBlock(block: ContentBlock, index: number) {
    switch (block.type) {
        case "heading":
            return <BlockHeading key={index} text={block.text} />;
        case "paragraph":
            return <BlockParagraph key={index} text={block.text} />;
        case "list":
            return <BlockList key={index} items={block.items} />;
        case "callout":
            return <BlockCallout key={index} text={block.text} title={block.title} />;
        case "quote":
            return <BlockQuote key={index} text={block.text} attribution={block.attribution} />;
    }
}

// ── Default export — convenience wrapper ──────────────────────────────────────

interface RenderContentBlocksProps {
    blocks: ContentBlock[];
}

export default function RenderContentBlocks({ blocks }: RenderContentBlocksProps) {
    return <>{blocks.map((block, i) => renderBlock(block, i))}</>;
}
